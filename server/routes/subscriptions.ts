import { Router } from "express";
import { storage } from "../storage";
import { db } from "../db";
import { sql } from "drizzle-orm";

const router = Router();

// Get all subscription plans
router.get("/plans", async (req, res) => {
  try {
    const plans = await db.execute(sql`
      SELECT 
        id,
        name,
        name_arabic,
        description,
        description_arabic,
        price,
        currency,
        duration,
        features,
        features_arabic,
        max_streams,
        max_downloads,
        has_hd_access,
        has_4k_access,
        has_offline_access,
        is_active
      FROM subscription_plans
      WHERE is_active = true
      ORDER BY price
    `);

    res.json(plans.rows);
  } catch (error) {
    console.error('Subscription plans error:', error);
    res.status(500).json({ error: "Failed to fetch subscription plans" });
  }
});

// Get subscription plan by ID
router.get("/plans/:id", async (req, res) => {
  try {
    const planId = parseInt(req.params.id);
    
    const plan = await db.execute(sql`
      SELECT * FROM subscription_plans 
      WHERE id = ${planId} AND is_active = true
    `);

    if (plan.rows.length === 0) {
      return res.status(404).json({ error: "Subscription plan not found" });
    }

    res.json(plan.rows[0]);
  } catch (error) {
    console.error('Subscription plan error:', error);
    res.status(500).json({ error: "Failed to fetch subscription plan" });
  }
});

// Get user's current subscription
router.get("/current/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    const subscription = await db.execute(sql`
      SELECT 
        us.*,
        sp.name,
        sp.name_arabic,
        sp.price,
        sp.features,
        sp.features_arabic,
        sp.max_streams,
        sp.max_downloads,
        sp.has_hd_access,
        sp.has_4k_access,
        sp.has_offline_access
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE us.user_id = ${userId} 
        AND us.status = 'active'
        AND us.end_date > NOW()
      ORDER BY us.created_at DESC
      LIMIT 1
    `);

    if (subscription.rows.length === 0) {
      return res.status(404).json({ error: "No active subscription found" });
    }

    res.json(subscription.rows[0]);
  } catch (error) {
    console.error('Current subscription error:', error);
    res.status(500).json({ error: "Failed to fetch current subscription" });
  }
});

// Create new subscription
router.post("/subscribe", async (req, res) => {
  try {
    const {
      userId,
      planId,
      stripeCustomerId,
      stripeSubscriptionId,
      startDate,
      endDate,
      autoRenew = true
    } = req.body;

    // Cancel existing active subscriptions
    await db.execute(sql`
      UPDATE user_subscriptions 
      SET status = 'cancelled', updated_at = NOW()
      WHERE user_id = ${userId} AND status = 'active'
    `);

    // Create new subscription
    const subscription = await db.execute(sql`
      INSERT INTO user_subscriptions (
        user_id, plan_id, status, start_date, end_date,
        stripe_customer_id, stripe_subscription_id, auto_renew
      ) VALUES (
        ${userId}, ${planId}, 'active', ${startDate}, ${endDate},
        ${stripeCustomerId}, ${stripeSubscriptionId}, ${autoRenew}
      )
      RETURNING *
    `);

    res.json(subscription.rows[0]);
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

// Cancel subscription
router.post("/cancel/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { reason } = req.body;

    const result = await db.execute(sql`
      UPDATE user_subscriptions 
      SET status = 'cancelled', auto_renew = false, updated_at = NOW()
      WHERE user_id = ${userId} AND status = 'active'
      RETURNING *
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No active subscription found" });
    }

    res.json({ success: true, message: "Subscription cancelled successfully" });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
});

// Get subscription analytics
router.get("/analytics", async (req, res) => {
  try {
    // Get subscription statistics
    const subscriptionStats = await db.execute(sql`
      SELECT 
        sp.name,
        sp.name_arabic,
        sp.price,
        COUNT(us.id) as subscriber_count,
        SUM(sp.price) as total_revenue,
        AVG(DATEDIFF(us.end_date, us.start_date)) as avg_duration
      FROM subscription_plans sp
      LEFT JOIN user_subscriptions us ON sp.id = us.plan_id 
        AND us.status = 'active'
      WHERE sp.is_active = true
      GROUP BY sp.id, sp.name, sp.name_arabic, sp.price
      ORDER BY subscriber_count DESC
    `);

    // Get monthly revenue trend
    const revenueData = await db.execute(sql`
      SELECT 
        DATE_FORMAT(us.start_date, '%Y-%m') as month,
        SUM(sp.price) as revenue,
        COUNT(us.id) as new_subscriptions
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE us.start_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(us.start_date, '%Y-%m')
      ORDER BY month
    `);

    // Get churn rate
    const churnData = await db.execute(sql`
      SELECT 
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
        ROUND(
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) * 100.0 / 
          COUNT(*), 2
        ) as churn_rate
      FROM user_subscriptions
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
    `);

    res.json({
      subscriptionStats: subscriptionStats.rows,
      revenueData: revenueData.rows,
      churnData: churnData.rows[0] || { cancelled: 0, active: 0, churn_rate: 0 }
    });
  } catch (error) {
    console.error('Subscription analytics error:', error);
    res.status(500).json({ error: "Failed to fetch subscription analytics" });
  }
});

// Update subscription settings
router.patch("/settings/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { autoRenew } = req.body;

    const result = await db.execute(sql`
      UPDATE user_subscriptions 
      SET auto_renew = ${autoRenew}, updated_at = NOW()
      WHERE user_id = ${userId} AND status = 'active'
      RETURNING *
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No active subscription found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update subscription settings error:', error);
    res.status(500).json({ error: "Failed to update subscription settings" });
  }
});

export default router;