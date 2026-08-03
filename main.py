import os
import sys
import threading
import http.server
import socketserver
import webbrowser

PORT = 8080
DIST_DIR = os.path.join(os.path.dirname(__file__), "dist")

class SinglePageAppHandler(http.server.SimpleHTTPRequestHandler):
    """Simple HTTP Request Handler that supports Single Page App (SPA) routing."""
    def __init__(self, *args, **kwargs):
        directory = DIST_DIR if os.path.exists(DIST_DIR) else os.path.dirname(__file__)
        super().__init__(*args, directory=directory, **kwargs)

    def do_GET(self):
        # Serve existing files, otherwise fallback to index.html for SPA routing
        path = self.translate_path(self.path)
        if not os.path.exists(path) and not self.path.startswith("/api"):
            self.path = "/index.html"
        return super().do_GET()

def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), SinglePageAppHandler) as httpd:
        print(f"🚀 Serving Student Routine App on http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    # Start local background HTTP server to serve dist assets
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()

    launched = False

    # Try Android Native WebView via Kivy & Pyjnius
    try:
        from kivy.app import App
        from kivy.uix.boxlayout import BoxLayout
        from jnius import autoclass
        from android.runnable import run_on_ui_thread

        WebView = autoclass('android.webkit.WebView')
        WebViewClient = autoclass('android.webkit.WebViewClient')
        activity = autoclass('org.kivy.android.PythonActivity').mActivity

        class AndroidApp(App):
            def build(self):
                self.create_webview()
                return BoxLayout()

            @run_on_ui_thread
            def create_webview(self):
                webview = WebView(activity)
                webview.getSettings().setJavaScriptEnabled(True)
                webview.getSettings().setDomStorageEnabled(True)
                webview.getSettings().setAllowFileAccess(True)
                webview.setWebViewClient(WebViewClient())
                activity.setContentView(webview)
                webview.loadUrl(f"http://127.0.0.1:{PORT}")

        AndroidApp().run()
        launched = True
    except Exception as e:
        print(f"Native Android WebView init skipped: {e}")

    # Fallback to PyWebView or Browser if not on Android Kivy
    if not launched:
        try:
            import webview
            webview.create_window("Student Routine & Academic Master", f"http://localhost:{PORT}", width=420, height=840)
            webview.start()
        except ImportError:
            print(f"Opening browser window at http://localhost:{PORT}...")
            webbrowser.open(f"http://localhost:{PORT}")
            try:
                server_thread.join()
            except KeyboardInterrupt:
                print("\nServer stopped gracefully.")

