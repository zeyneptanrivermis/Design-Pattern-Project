import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.util.concurrent.Executors;

public class SimpleHttpServer {

  private static final String FRONTEND_ROOT = "../frontend";
  private static final int PORT = 8000;

  public static void main(String[] args) throws IOException {
    HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

    System.out.println("Starting server...");

    server.createContext("/", new FileHandler());

    server.setExecutor(Executors.newCachedThreadPool());

    server.start();
    System.out.println(
      "✅ Frontend Server has started. Please go to the following address in your browser:"
    );
    System.out.println("http://localhost:" + PORT + "/index.html");
    System.out.println("Çıkmak için (Ctrl+C) basın.");
  }

  static class FileHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
      String path = exchange.getRequestURI().getPath();
      if (path.equals("/")) {
        path = "/index.html";
      }

      File file = new File(FRONTEND_ROOT + path).getCanonicalFile();

      if (
        !file.getPath().startsWith(new File(FRONTEND_ROOT).getCanonicalPath())
      ) {
        sendResponse(exchange, 403, "403 Forbidden");
        return;
      }

      if (!file.exists() || file.isDirectory()) {
        sendResponse(exchange, 404, "404 Not Found: " + file.getPath());
        return;
      }

      String mimeType = getMimeType(file.getName());

      try {
        byte[] bytes = Files.readAllBytes(file.toPath());
        exchange.getResponseHeaders().set("Content-Type", mimeType);
        exchange.sendResponseHeaders(200, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
      } catch (IOException e) {
        sendResponse(
          exchange,
          500,
          "500 Internal Server Error: " + e.getMessage()
        );
      }
    }

    private void sendResponse(
      HttpExchange exchange,
      int statusCode,
      String response
    ) throws IOException {
      exchange.sendResponseHeaders(statusCode, response.length());
      OutputStream os = exchange.getResponseBody();
      os.write(response.getBytes());
      os.close();
    }

    private String getMimeType(String fileName) {
      if (fileName.endsWith(".html")) return "text/html";
      if (fileName.endsWith(".css")) return "text/css";
      if (fileName.endsWith(".js")) return "application/javascript";
      return "text/plain";
    }
  }
}
