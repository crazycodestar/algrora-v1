import * as Yup from "yup";

export const storeValidationSchema = Yup.object().shape({
	images: Yup.array().min(1).required(),
	storeName: Yup.string().min(3).max(255).required(),
	storeDescription: Yup.string().min(20).max(400).required(),
	// productCategory: Yup.string().min()
});

export const userValidationSchema = Yup.object().shape({
	images: Yup.array().max(1).required(),
	username: Yup.string().min(3).max(255).required(),
	interests: Yup.array().min(3).required(),
	roomAddress: Yup.string().required(),
	contact: Yup.string().min(11).max(11).required(),
});
