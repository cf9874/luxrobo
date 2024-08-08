/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { plainToInstance } from "class-transformer"
import { apiUtil } from "apis/api.util"
import { AxiosController, IWrapperData } from "apis/api.controller"
import { ContactDto, ContactHandleDto } from "apis/dto"
import { dummyData } from "dummy"
import { CONTACT_TYPE } from "@const/support.const"

export class ContactApi {
  constructor(private controller: AxiosController) {}
  // GET
  // /api/v1/contacts
  // Get Contacts by ID
  async getOne(contactId: number) {
    // const res = await this.controller.get<IWrapperData<ContactDto>>({
    //   url: `api/v1/contacts?contactID=${contactId}`,
    // })

    // if (apiUtil.isErrorResponse(res)) {
    //   return res
    // }

    return plainToInstance(ContactDto, dummyData.contacts).toJson<ContactDto>()
  }

  // PUT
  // /api/v1/contacts/edit
  // Contacts Edit
  async edit(editDto: {
    contactId: number
    contact: {
      title: string
      writer: string
      phone_number: string
      tag: CONTACT_TYPE
      content: string
    }
  }) {
    // const res = await this.controller.put<IWrapperData<ContactHandleDto>>({
    //   url: `api/v1/contacts/edit?contactID=${editDto.contactId}`,
    //   body: editDto.contact,
    // })
    // if (apiUtil.isErrorResponse(res)) {
    //   return res
    // }

    return dummyData.contacts_edit.message === "success"
  }

  // GET
  // /api/v1/contacts/list
  // Get Contacts List
  async getList() {
    // const res = await this.controller.get<IWrapperData<ContactDto[]>>({
    //   url: `api/v1/contacts/list`,
    // })

    // if (apiUtil.isErrorResponse(res)) {
    //   return res
    // }

    return dummyData.contacts_list.map(contact => plainToInstance(ContactDto, contact).toJson<ContactDto>())
  }

  // POST
  // /api/v1/contacts/new
  // Create Contacts
  async create(createDto: { title: string; writer: string; phone_number: string; tag: CONTACT_TYPE; content: string }) {
    const res = await this.controller.post<IWrapperData<ContactHandleDto>>({
      url: `api/v1/contacts/new`,
      body: createDto,
    })

    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return res
  }

  // DELETE
  // /api/v1/contacts/remove
  // Contacts Remove
  async delete(contactId: number) {
    // const res = await this.controller.delete<IWrapperData<ContactHandleDto>>({
    //   url: `api/v1/contacts/remove?contactID=${contactId}`,
    // })

    // if (apiUtil.isErrorResponse(res)) {
    //   return res
    // }

    return dummyData.contacts_remove.message === "success"
  }
}
