import { cookies } from "next/headers"
import { Mail } from "@/components/admin/mail/mail"
import { mails } from "@/components/admin/mail/data"

export default async function MailPage() {
  const layout = (await cookies()).get("react-resizable-panels:layout:mail")

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined

  return (
    <>
    
      
        <Mail
          mails={mails}
          defaultLayout={defaultLayout}
        />
    </>
  )
}
