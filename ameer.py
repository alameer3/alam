import requests

url = "https://drive.google.com/uc?export=download&id=1LIzuWned5_YMnwbOIpRnWbjTtCPgjT-G"
filename = "downloaded_file.ext"

response = requests.get(url, allow_redirects=True)
with open(filename, "wb") as f:
    f.write(response.content)

print("تم تحميل الملف بنجاح:", filename)