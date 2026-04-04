"""Retake all DisbursePro screenshots using Selenium headless Chrome."""
import os, sys, time, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE = "http://localhost:5174"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "screenshots")
os.makedirs(OUT, exist_ok=True)

# All pages to screenshot
PAGES = [
    # Auth
    ("01-login", "/login"),
    ("02-register", "/register"),
    # Platform Operator
    ("03-platform-dashboard", "/platform"),
    ("04-platform-companies", "/platform/companies"),
    ("05-platform-company-detail", "/platform/companies/COMP-001"),
    ("06-platform-revenue", "/platform/revenue"),
    ("07-platform-settings", "/platform/settings"),
    # Company Portal
    ("08-company-dashboard", "/dashboard"),
    ("09-employees", "/employees"),
    ("10-employee-new", "/employees/new"),
    ("11-employee-detail", "/employees/EMP-001"),
    ("12-employee-bulk-upload", "/employees/bulk-upload"),
    ("13-disburse-single", "/disburse"),
    ("14-disburse-bulk", "/disburse/bulk"),
    ("15-disburse-review", "/disburse/review/DSB-001"),
    ("16-approvals", "/approvals"),
    ("17-approval-detail", "/approvals/DSB-004"),
    ("18-transactions", "/transactions"),
    ("19-transaction-detail", "/transactions/DSB-001"),
    ("20-reports", "/reports"),
    ("21-settings", "/settings"),
    ("22-audit-log", "/audit-log"),
    ("23-coming-soon", "/coming-soon"),
    # Phase 2
    ("24-phase2-cards", "/cards"),
    ("25-phase2-deposits", "/deposits"),
    ("26-phase2-mobile-app", "/mobile-app"),
    ("27-phase2-forex", "/forex"),
    ("28-phase2-integrations", "/integrations"),
    # Notifications
    ("35-notifications", "/notifications"),
]

# Dark mode pages
DARK_PAGES = [
    ("29-login-dark", "/login"),
    ("30-company-dashboard-dark", "/dashboard"),
    ("31-platform-dashboard-dark", "/platform"),
    ("32-employees-dark", "/employees"),
    ("33-disburse-single-dark", "/disburse"),
    ("34-approvals-dark", "/approvals"),
    ("36-transactions-dark", "/transactions"),
    ("37-reports-dark", "/reports"),
    ("38-platform-companies-dark", "/platform/companies"),
    ("39-audit-log-dark", "/audit-log"),
    ("40-disburse-review-dark", "/disburse/review/DSB-001"),
    ("41-settings-dark", "/settings"),
    ("42-notifications-dark", "/notifications"),
    ("43-coming-soon-dark", "/coming-soon"),
    ("44-phase2-cards-dark", "/cards"),
    ("45-phase2-mobile-app-dark", "/mobile-app"),
]

# Mobile pages
MOBILE_PAGES = [
    ("m-01-login", "/login"),
    ("m-02-dashboard", "/dashboard"),
    ("m-03-employees", "/employees"),
    ("m-04-disburse", "/disburse"),
    ("m-05-approvals", "/approvals"),
    ("m-06-transactions", "/transactions"),
]

def make_driver(width=1440, height=900):
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--force-device-scale-factor=1")
    opts.add_argument(f"--window-size={width},{height}")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--no-sandbox")
    driver = webdriver.Chrome(options=opts)
    driver.set_window_size(width, height)
    return driver

def wait_loaded(driver, timeout=5):
    time.sleep(1.5)
    try:
        WebDriverWait(driver, timeout).until(
            lambda d: d.execute_script("return document.readyState") == "complete"
        )
    except:
        pass
    time.sleep(0.5)

def set_theme(driver, theme):
    """Set light or dark theme via localStorage and reload."""
    driver.execute_script(f"""
        localStorage.setItem('disbursepro-theme', '{theme}');
        document.documentElement.classList.{'add' if theme == 'dark' else 'remove'}('dark');
    """)
    driver.refresh()
    wait_loaded(driver)

def screenshot(driver, name):
    path = os.path.join(OUT, f"{name}.png")
    driver.save_screenshot(path)
    print(f"  Saved: {name}.png")

def main():
    # Desktop light mode
    print("=== Light Mode (Desktop 1440x900) ===")
    driver = make_driver(1440, 900)
    try:
        # Set light mode first
        driver.get(BASE + "/login")
        wait_loaded(driver)
        set_theme(driver, "light")

        for name, path in PAGES:
            driver.get(BASE + path)
            wait_loaded(driver)
            screenshot(driver, name)

        print(f"\nLight mode: {len(PAGES)} screenshots")
    finally:
        driver.quit()

    # Desktop dark mode
    print("\n=== Dark Mode (Desktop 1440x900) ===")
    driver = make_driver(1440, 900)
    try:
        driver.get(BASE + "/login")
        wait_loaded(driver)
        set_theme(driver, "dark")

        for name, path in DARK_PAGES:
            driver.get(BASE + path)
            wait_loaded(driver)
            # Ensure dark mode persists
            is_dark = driver.execute_script("return document.documentElement.classList.contains('dark')")
            if not is_dark:
                set_theme(driver, "dark")
            screenshot(driver, name)

        print(f"\nDark mode: {len(DARK_PAGES)} screenshots")
    finally:
        driver.quit()

    # Mobile
    print("\n=== Mobile (375x812) ===")
    driver = make_driver(375, 812)
    try:
        driver.get(BASE + "/login")
        wait_loaded(driver)
        set_theme(driver, "light")

        for name, path in MOBILE_PAGES:
            driver.get(BASE + path)
            wait_loaded(driver)
            screenshot(driver, name)

        print(f"\nMobile: {len(MOBILE_PAGES)} screenshots")
    finally:
        driver.quit()

    total = len(PAGES) + len(DARK_PAGES) + len(MOBILE_PAGES)
    print(f"\n=== TOTAL: {total} screenshots retaken ===")

if __name__ == "__main__":
    main()
