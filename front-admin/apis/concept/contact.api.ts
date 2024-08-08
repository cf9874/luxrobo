import { AxiosController, IWrapperData } from "../api.controller"
import { apiUtil } from "../api.util"
import { ContactDto } from "../dto"

export class ContactApi {
  constructor(private controller: AxiosController) {}

  async getContact(contactID: number) {
    // const response = await this.controller.get<IWrapperData<ContactDto>>({
    //   url: `/api/v1/admin/contacts?contactID=${contactID}`,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return {
      contactID: 1,
      content: "content",
      created_at: "created_at",
      phone_number: "phone_number",
      reply: "reply",
      tag: 2,
      title: "title",
      updated_at: "updated_at",
      userID: 0,
      writer: "writer",
    } as ContactDto
  }

  async editContact(
    contactID: number,
    contactEdit: {
      content: string
      phone_number: string
      reply: string
      tag: number
      title: string
      writer: string
    },
  ) {
    // const response = await this.controller.put<
    //   IWrapperData<{
    //     contactID: number
    //     message: string
    //   }>
    // >({
    //   url: `/api/v1/admin/contacts/edit?contactID=${contactID}`,
    //   body: contactEdit,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return {
      contactID: 0,
      message: "success",
    }
  }

  async removeContacts(contactIDs: number[]) {
    // const response = await this.controller.delete<
    //   IWrapperData<{
    //     contactIDs: number[]
    //     message: string
    //   }>
    // >({
    //   url: `/api/v1/admin/contacts/remove`,
    //   options: { data: { contactIDs } },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return {
      contactIDs: [0],
      message: "success",
    }
  }

  async searchContacts(keyword: string, conditions: { is_match: boolean; range: number }) {
    // const response = await this.controller.get<IWrapperData<ContactDto[]>>({
    //   url: `/api/v1/admin/contacts/searchkeyword=${keyword}`,
    //   options: {
    //     params: conditions,
    //   },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return [
      {
        contactID: 0,
        content: "content",
        created_at: "created_at",
        phone_number: "phone_number",
        reply: "reply",
        tag: 1,
        title: "title",
        updated_at: "updated_at",
        userID: 0,
        writer: "writer",
      } as ContactDto,
      {
        contactID: 1,
        content: "content",
        created_at: "created_at",
        phone_number: "phone_number",
        reply: "reply",
        tag: 2,
        title: "title",
        updated_at: "updated_at",
        userID: 0,
        writer: "writer",
      } as ContactDto,
    ] as ContactDto[]
  }
}
