import sendMail from "./emailService.js";

const sendEmail=async (to, subject, text)=>{
    const result = await sendMail(to.to, to.subject, to.text);
    if(result){
        return true;
    }
    return false;
}

export default sendEmail;

