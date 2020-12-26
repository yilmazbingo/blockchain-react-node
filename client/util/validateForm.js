import Joi from "joi-browser";
const schema = Joi.object({
  recipient: Joi.string().alphanum().invalid("<").required().label("Address"),
  //label is to capitalize username
  amount: Joi.number().required().label("Amount"),
  label: Joi.string().max(256),
});

// export default (formValues) => {
//   const errors = {};
//   if (!formValues.address) {
//     errors.address = "You Must Enter a Valid Address";
//   }
//   if (!formValues.amount) {
//     errors.amount = "You Must Enter Amount";
//   }
//   return errors;
// };

export default (formValues) => {
  const options = { abortEarly: false }; //Joi termianates validation once it finds an error
  const { error } = Joi.validate(formValues, schema, options);
  if (!error) return null;
  const errors = {};
  for (let item of error.details) {
    errors[item.path[0]] = item.message;
    console.log(errors);
    return errors;
  }
};
