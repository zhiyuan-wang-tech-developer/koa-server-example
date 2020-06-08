import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Put,
  HttpCode,
  NotFoundError,
  Authorized,
} from "routing-controllers";
import User from "./entity"; // import user model

@JsonController("/users")
export default class UserController {
  @Get("/:id")
  getUser(@Param("id") id: number) {
    /** @Param("id") decorator retrieves the id route parameter from the url */
    return User.findOne(id);
  }

  @Get("")
  async getAllUsers() {
    const users = await User.find();
    return { users };
  }

  @Authorized()
  @Put("/:id")
  async updateUser(@Param("id") id: number, @Body() update: Partial<User>) {
    // Find the user using the given id.
    const user = await User.findOne(id);
    if (!user) {
      // If the user does not exist, throw an error.
      throw new NotFoundError("Cannot find user!");
    }
    // If the user exists, overwrite the properties that are updated and save the updated user.
    return User.merge(user, update).save();
  }

  @Post("")
  @HttpCode(201) // Set the default HTTP response code 201 Created
  async createUser(@Body() user: User) {
    const { password, ...userInfo } = user;
    const userInstance = User.create(userInfo);
    await userInstance.setPassword(password); // here password is plain text.
    // Save the user instance to database and return the result.
    return userInstance.save();
  }
}
