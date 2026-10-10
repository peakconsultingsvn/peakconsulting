export const services=['Artificial Intelligence','Process Automation','Web Development','Custom Application','Technology Consulting','Other'];
export const emailPattern=/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const forbidden=/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
export function validateContact(input){
 const data={},errors={};
 if(!input||typeof input!=='object'||Array.isArray(input))return{data,errors:{form:'Please submit a valid inquiry.'}};
 const fields={fullName:[2,100],company:[2,160],email:[3,254],phone:[5,40],service:[1,60],budget:[0,100],details:[20,5000]};
 for(const [key,[min,max]] of Object.entries(fields)){
  const value=input[key]??'';
  if(typeof value!=='string'){errors[key]='Please enter a valid text value.';continue;}
  data[key]=value.normalize('NFC').trim();
  if(data[key].length<min||data[key].length>max||forbidden.test(data[key])||(key!=='details'&&/[\r\n]/.test(data[key])))errors[key]=`Please enter ${min} to ${max} characters.`;
 }
 if(!errors.email&&!emailPattern.test(data.email))errors.email='Please enter a valid business email address.';
 if(!errors.phone&&(!/^[+()\d\s.\-]+$/.test(data.phone)||data.phone.replace(/\D/g,'').length<5))errors.phone='Please enter a valid phone number.';
 if(!services.includes(data.service))errors.service='Please select a service of interest.';
 if(input.consent!==true)errors.consent='Please agree to the use of your information to respond to your inquiry.';
 if(typeof input.website!=='string'||input.website.trim()!=='')errors.form='We could not submit your inquiry. Please review the information and try again.';
 if(!Number.isFinite(input.startedAt)||Date.now()-input.startedAt<2000||Date.now()-input.startedAt>86400000)errors.form='Please review your inquiry and try again.';
 // Allowlisted plain text, normalized and trimmed. No HTML interpolation or persistence.
 return{data,errors};
}


export function validatePartnership(input){
 const data={},errors={};
 if(!input||typeof input!=='object'||Array.isArray(input))return{data,errors:{form:'Please submit valid contact information.'}};
 for(const [key,max] of [['email',254],['phone',40]]){
  const value=input[key]??'';
  if(typeof value!=='string'){errors[key]='Please enter a valid text value.';continue;}
  data[key]=value.normalize('NFC').trim();
  if(data[key].length>max||forbidden.test(data[key])||/[\r\n]/.test(data[key]))errors[key]='Please enter valid contact information.';
 }
 if(!data.email&&!data.phone)errors.email='Please provide a contact email or phone number.';
 if(data.email&&!emailPattern.test(data.email))errors.email='Please enter a valid email address.';
 if(data.phone&&(!/^[+()\d\s.\-]+$/.test(data.phone)||data.phone.replace(/\D/g,'').length<5))errors.phone='Please enter a valid phone number.';
 if(input.consent!==true)errors.consent='Please agree to be contacted about sales collaboration.';
 if(typeof input.website!=='string'||input.website.trim()!==''||!Number.isFinite(input.startedAt)||Date.now()-input.startedAt<2000||Date.now()-input.startedAt>86400000)errors.form='Please review your information and try again.';
 return{data,errors};
}
