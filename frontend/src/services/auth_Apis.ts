import { axiosInstance } from './client/AxiosClient'
import type { UserData, Credentials } from './models';


export async function signup(data: UserData) {
  try {
    const response = await axiosInstance.post('/auth/signup', data);
    console.log('user added successfully:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}


export async function signin(data: Credentials) {
  try {
    const response = await axiosInstance.post('/auth/login', data);
    console.log('signin successful:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error signing in user:', error);
    throw error;
  }
}


