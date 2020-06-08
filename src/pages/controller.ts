import {
  JsonController,
  Param,
  Get,
  Put,
  Body,
  Post,
  HttpCode,
  NotFoundError,
  Authorized,
} from "routing-controllers";
import Page from "./entity"; // import page model

/*
 * This makes sure a class is marked as controller that always returns JSON perfect for our REST API.
 */
@JsonController("/pages")
export default class PageController {
  /*
   * This markes a method as endpoint.
   * In this case it responds to any GET /pages/:id
   * request with :id being a route parameter
   */
  @Get("/:id")
  getPage(@Param("id") id: number) {
    /** @Param("id") decorator retrieves the id route parameter from the url */
    return Page.findOne(id);
  }

  @Get("")
  async getAllPages() {
    const pages = await Page.find();
    // console.log(pages);
    return { pages };
  }

  @Authorized()
  @Put("/:id")
  async updatePage(@Param("id") id: number, @Body() update: Partial<Page>) {
    console.log("Incoming PUT request's body param:", update);
    // Find the page using the given id.
    const page = await Page.findOne(id);
    if (!page) {
      // If the page does not exist, throw an error.
      throw new NotFoundError("Cannot find page!");
    }
    // If the page exists, overwrite the properties that are updated and save the updated page.
    return Page.merge(page, update).save();
  }

  @Authorized()
  @Post("")
  @HttpCode(201) // Set the default HTTP response code 201 Created
  createPage(@Body() page: Page) {
    console.log("Incoming POST request's body param:", page);
    // Save the page that we get and return the result.
    return page.save();
  }
}
