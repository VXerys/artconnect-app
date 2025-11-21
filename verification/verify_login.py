from playwright.sync_api import Page, expect, sync_playwright
import os

def verify_login_page(page: Page):
    # Navigate to Login Page
    print("Navigating to login page...")
    page.goto("http://localhost:5173/login")

    # Wait for page to load
    print("Waiting for content...")
    page.wait_for_load_state("networkidle")

    # Take intermediate screenshot
    print("Taking debug screenshot...")
    page.screenshot(path="/app/verification/debug_login.png")

    # Expect to see "Welcome Back"
    print("Checking 'Welcome Back' text...")
    expect(page.get_by_text("Welcome Back")).to_be_visible(timeout=10000)

    # Expect Email Input
    print("Checking Email input...")
    expect(page.get_by_label("Email")).to_be_visible()

    # Expect Password Input
    print("Checking Password input...")
    expect(page.get_by_label("Password")).to_be_visible()

    # Expect Sign In Button
    print("Checking Sign In button...")
    expect(page.get_by_role("button", name="Sign In", exact=True)).to_be_visible()

    # Take final screenshot
    print("Taking final screenshot...")
    page.screenshot(path="/app/verification/login_page.png")

    # Verify file exists
    if os.path.exists("/app/verification/login_page.png"):
        print("Screenshot saved successfully.")
    else:
        print("Error: Screenshot file not found.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_login_page(page)
            print("Verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="/app/verification/error_state.png")
        finally:
            browser.close()
