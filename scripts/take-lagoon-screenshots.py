"""Take screenshots of DisbursePro v4-lagoon for verification."""
import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

BASE = "http://localhost:5175"
OUT = r"D:\disbursement-platform\screenshots-lagoon"
os.makedirs(OUT, exist_ok=True)

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1440,900")
options.add_argument("--force-device-scale-factor=1")
options.add_argument("--disable-gpu")

driver = webdriver.Chrome(options=options)
driver.implicitly_wait(2)

pages = [
    ("01-login", "/login"),
    ("02-register", "/register"),
    ("03-platform-dashboard", "/platform"),
    ("04-platform-companies", "/platform/companies"),
    ("05-platform-company-detail", "/platform/companies/comp-001"),
    ("06-platform-revenue", "/platform/revenue"),
    ("07-platform-settings", "/platform/settings"),
    ("08-company-dashboard", "/dashboard"),
    ("09-employees", "/employees"),
    ("10-employee-new", "/employees/new"),
    ("11-employee-detail", "/employees/emp-001"),
    ("12-employee-bulk-upload", "/employees/bulk-upload"),
    ("13-disburse-single", "/disburse"),
    ("14-disburse-bulk", "/disburse/bulk"),
    ("15-disburse-review", "/disburse/review/DSB-0101"),
    ("16-approvals", "/approvals"),
    ("17-approval-detail", "/approvals/DSB-0103"),
    ("18-transactions", "/transactions"),
    ("19-transaction-detail", "/transactions/DSB-0101"),
    ("20-reports", "/reports"),
    ("21-settings", "/settings"),
    ("22-audit-log", "/audit-log"),
    ("23-notifications", "/notifications"),
    ("24-coming-soon", "/coming-soon"),
    ("25-phase2-cards", "/cards"),
    ("26-phase2-deposits", "/deposits"),
    ("27-phase2-mobile-app", "/mobile-app"),
    ("28-phase2-forex", "/forex"),
    ("29-phase2-integrations", "/integrations"),
]

for name, path in pages:
    url = f"{BASE}{path}"
    driver.get(url)
    time.sleep(1.5)
    filepath = os.path.join(OUT, f"{name}.png")
    driver.save_screenshot(filepath)
    print(f"OK {name}")

driver.quit()
print(f"\nDone! {len(pages)} screenshots saved to {OUT}")
