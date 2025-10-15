import PicnicClient from "picnic-api";

export async function getPicnicClient() {
    const email = process.env.PICNIC_EMAIL as string
    const password = process.env.PICNIC_PASSWORD as string

    const picnicClient = new PicnicClient({
        countryCode: process.env.PICNIC_COUNTRY_CODE as "DE" | "NL" || "DE"
    });

    await picnicClient.login(email, password);

    return picnicClient
}

