import dotenv from "dotenv"
dotenv.config()
import { GoogleSpreadsheet } from "google-spreadsheet";

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);

async function saveGoogle(data: any): Promise<void> {
    try{
        await doc.useServiceAccountAuth({
            client_email: `${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`,
            private_key: `${process.env.GOOGLE_PRIVATE_KEY}`.replace(/\\n/g, "\n"),
          });
        
          await doc.loadInfo();
          const sheet = doc.sheetsByIndex[0];
          
          await sheet.addRows(data);
    }catch(e){
        console.log('Error',e)
    }
}

export default saveGoogle;