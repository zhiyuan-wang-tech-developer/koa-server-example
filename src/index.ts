import "reflect-metadata";
import { createKoaServer, Action } from "routing-controllers";
import MainController from "./controller";
import PageController from "./pages/controller";
import UserController from "./users/controller";
import setupDatabase from "./database";
import LoginController from "./logins/controller";
import { verify } from "./jwt";

const PORT = process.env.PORT || 4000;

setupDatabase();

const app = createKoaServer({
  controllers: [
    MainController,
    PageController,
    UserController,
    LoginController,
  ],
  authorizationChecker: (action: Action) => {
    // retrieve the request header "Authorization"
    const authorizationHeader: string = action.request.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      // mind the whitespace after "Bearer"
      const [, token] = authorizationHeader.split(" ");
      // check if the user supplied a valid JWT token or not.
      // NOTE: a double exclamation mark !! will transform any variable into a boolean.
      return !!(token && verify(token));
    }
    // if there is no valid header
    return false;
  },
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
