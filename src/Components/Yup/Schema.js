import * as yup from 'yup';

export const Schema = yup.object().shape({
    email:yup.string().email('Please enter a valid email address').required('Required'),
    password:yup.string().min(7).required('Required')
});