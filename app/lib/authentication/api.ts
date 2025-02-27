'use server'

import { redirect } from "next/navigation"
import { createSession, deleteSession, getUser } from "@/app/lib/session/api"
import { createUserData, fetchUserList } from "../data/api"
import { UserData } from "../data/type"
import bcrypt from "bcryptjs"

export async function signup(userData: UserData) {
  // 1. Validate form fields
  // ...

  // 2. Prepare data for insertion into database
  const { name, department, password } = userData
  // e.g. Hash the user's password before storing it
  const hashedPassword = await hashPassword(password)

  // 3. Insert the user into the database or call an Auth Library's API
  const cryptedUserData: UserData = {
    id: -1,
    name: name,
    password: hashedPassword,
    department: department,
  }
  const user = await createUserData(cryptedUserData)

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  // 4. Create user session
  await createSession(user.id)
  // 5. Redirect user
  redirect("/")
}

export async function login(username: string, password: string) {
  const users = await fetchUserList();
  if(!users) redirect("/result/error");

  let foundUser: UserData | undefined
  for (const user of users) {
    if (user.name === username && (await bcrypt.compare(password, user.password))) {
      foundUser = user;
      break;
    }
  }
  
  if(foundUser){
    await createSession(foundUser.id.toString())
    redirect("/")
  }
  else {
    return {
      message: 'user not found',
    }
  }
} 


export async function logout() {
  deleteSession()
  redirect('/auth/login')
}


async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}