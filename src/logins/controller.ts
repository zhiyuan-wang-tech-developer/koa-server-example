import { IsString } from "class-validator";
import {
  JsonController,
  Post,
  Body,
  BadRequestError,
} from "routing-controllers";
import User from "../users/entity";
import { sign } from "../jwt";

class AuthenticatePayload {
  @IsString()
  email: string = "";

  @IsString()
  password: string = "";
}

@JsonController("/logins")
export default class LoginController {
  @Post("")
  async authenticate(@Body() { email, password }: AuthenticatePayload) {
    // look up the user based on the email field
    const user = await User.findOne({ where: { email } });
    if (!user || !user.id) {
      // If user does not exist or user.id is undefined
      // Send HTTP 400 Bad Request Error
      throw new BadRequestError("A user with this email does not exist!");
    }
    if (!(await user.checkPassword(password))) {
      // If password is incorrect
      // Send HTTP 400 Bad Request Error
      throw new BadRequestError("The password is not correct!");
    }
    // If user exists and password is correct, send back a jwt token.
    /**
     * NOTE: If you remove ! after user.id, your IDE will complain about
     * the fact that user.id might be undefined.
     * An exclamation mark ! tells the TypeScript compiler
     * 'don't worry, I know for sure this is not going to be undefined'.
     */
    const data = { id: user.id! };
    const jwt: string = sign(data);
    return { jwt };
  }
}
