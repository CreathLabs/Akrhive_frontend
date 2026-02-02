import axios from "axios";

export const uploadToCloudinary = async (image: File) => {
    try {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "codexx");
        data.append("cloud_name", "dk6uhtgvo");
        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dk6uhtgvo/image/upload",
            data
        );

        const { secure_url }: { secure_url: string } = res.data;
        return secure_url;
    } catch (error) {
        throw error;
    }
};

export const uploadFiles = (files: File[]) => {
    const uploadPromises: any = files.map((file) => {
        return new Promise((resolve, reject) => {
            uploadToCloudinary(file)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    });

    return Promise.all(uploadPromises);
};