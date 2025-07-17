import os

try:
    import gdown
except ImportError:
    os.system("pip install gdown")
    import gdown

# معرّف الملف من Google Drive
file_id = "1YmLVXDQmwR7OTMrDjiyRd7zacynRjLF2"

# صيغة الرابط المباشر
url = f"https://drive.google.com/uc?id={file_id}"

# تحميل الملف
output_file = "downloaded_file.zip"  # يمكنك تغيير الاسم حسب نوع الملف
gdown.download(url, output_file, quiet=False)

print(f"\n✅ تم تحميل الملف وحفظه باسم: {output_file}")