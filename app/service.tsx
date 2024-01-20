import { getServers } from "dns";

// const URL = "http://localhost:5000";
const URL = "https://chatoo-api.onrender.com";

export const getTokenData = () => {
  const storageData: Object | any =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("token") || "{}")
      : null;
  return storageData;
};

export const getAdminToken = () => {
  const storageData: any =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("admin") || 'false')
      : false;
    const admin = storageData?.isConfirmed
    // console.log('.... admin token', storageData);
  return admin;
};

export type propsTypes = {
  username: any; //string,
  password: any; //string,
  title: any; //string,
  participants: any; //[],
  profile: any; //string,
  id: any; //string,
  user: any; //object
  updatedUser: any; //Object,
  isDeleted: any; //boolean,
};

export const signIn = async ({ username, password }: any) => {
  const authType = "cms";
  const response = await fetch(URL + "/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify({ username, password, authType }),
  });
  // console.log("....response", response);
  const data = await response.json();
  if (!data?.token) return alert(`${data?.message}`);
  // console.log("....service login", data);
  localStorage.setItem("token", JSON.stringify(data));
  return data;
};

export const Logout = async (state: any) => {
  const admin = state?.admin;
  const userId = admin?._id;
  const token = state?.token;
  const authType = "cms";
  // console.log('....logout began', { userId, token, authType });
  const response = await fetch(URL + "/api/logout/" + userId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify({ authType }),
  });
  // console.log('....logout res', response);
  if (!response.ok) {
    // console.log('....error logging out',);
    throw new Error("Network response was not ok");
  }

  const data = response.json();
  // console.log('....logout', data);

  localStorage.removeItem("token");

  return;
};



export const getAllUsers = async () => {
  const storageData = getTokenData();
  const token = storageData?.token;
  const response = await fetch(URL + "/api/users/list", {
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      authType: "cms",
      token: token,
    },
  });

  if (response.status === 401) {
    // console.log('....401 logout getAllUsers', response);
    await Logout(storageData);
    localStorage.removeItem("token");
    throw new Error("Unauthorized: Logging out user");
  }

  const data = await response.json();
  return data;
};

export const getUsers = async (isDeleted: any) => {
  const storageData = getTokenData();
  const token = storageData?.token;
  const response = await fetch(URL + "/api/users/list/users", {
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      authType: "cms",
      token: token,
      isDeleted: isDeleted,
    },
  });

  if (response.status === 401) {
    // console.log('....401 logout getUsers', response);
    await Logout(storageData);
    localStorage.removeItem("token");
    throw new Error("Unauthorized: Logging out user");
  }

  const data = await response.json();
  return data;
};

export const createUser = async (data: any) => {
  const storageData = getTokenData();
  const token = storageData?.token;
  const response = await fetch(URL + "/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      authType: "cms",
      token: token,
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401) {
    // console.log('....401 logout createUser', response);
    await Logout(storageData);
    localStorage.removeItem("token");
    throw new Error("Unauthorized: Logging out user");
  }
};

export const editUser = async ({ user, updatedUser }: any) => {
  const storageData = getTokenData();
  const token = storageData?.token;
  const response = await fetch(URL + "/api/users/" + user._id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      authType: "cms",
      token: token,
    },
    body: JSON.stringify(updatedUser),
  });

  if (response.status === 401) {
    // console.log('....401 logout editUser', response);
    await Logout(storageData);
    localStorage.removeItem("token");
    throw new Error("Unauthorized: Logging out user");
  }
  // console.log("Success:", updatedUser);

  const data = await response.json();
  return data;
};

export const deleteUser = async (user: any) => {
  const storageData = getTokenData();
  const token = storageData?.token;
  const response = await fetch(URL + "/api/users/" + user._id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      authType: "cms",
      token: token,
    },
    body: JSON.stringify({
      username: user.username,
      email: user.email,
      isDeleted: !user.isDeleted,
    }),
  });

  if (response.status === 401) {
    // console.log('....401 logout deleteUser', response);
    await Logout(storageData);
    localStorage.removeItem("token");
    throw new Error("Unauthorized: Logging out user");
  }

  const data = await response.json();
  return data;
};



export const getGroups = async () => {
  const storageData = getTokenData();
  const token = storageData?.token;
  const response = await fetch(URL + "/api/conversation/groups/list", {
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      authType: "cms",
      token: token,
    },
  });

  if (response.status === 401) {
    // console.log('....401 logout getGroups', response);
    await Logout(storageData);
    localStorage.removeItem("token");
    throw new Error("Unauthorized: Logging out user");
  }

  const data = await response.json();
  // console.log('....datagrp', data);
  return data;
};

export const createGroup = async ({ title, participants }: any) => {
  const storageData = getTokenData();
  const token = storageData?.token;
  const response = await fetch(URL + "/api/conversation/groups/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      authType: "cms",
      token: token,
    },
    body: JSON.stringify({
      title,
      participants,
    }),
  });

  if (response.status === 401) {
    // console.log('....401 logout createGroup', response);
    await Logout(storageData);
    localStorage.removeItem("token");
    throw new Error("Unauthorized: Logging out user");
  }

  const data = await response.json();

  // console.log("....Success:", title, participants);
  // console.log("....Success22:", data);

  return data;
};

export const editGroup = async ({ id, title, participants, profile }: any) => {
  const storageData = getTokenData();
  const token = storageData?.token;
  const response = await fetch(URL + "/api/conversation/groups/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      authType: "cms",
      token: token,
    },
    body: JSON.stringify({ title, participants, profile }),
  });

  if (response.status === 401) {
    // console.log('....401 logout editGroup', response);
    await Logout(storageData);
    localStorage.removeItem("token");
    throw new Error("Unauthorized: Logging out user");
  }
  // console.log("Success3:", title, participants, id);

  const data = await response.json();
  // console.log('....data', data);
  return data;
};

export const deleteGroup = async (group: any) => {
  const storageData = getTokenData();
  const token = storageData?.token;
  const id = group._id;
  // console.log('....group', id);
  const response = await fetch(URL + "/api/conversation/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      authType: "cms",
      token: token,
    },
    body: JSON.stringify({ type: "group" }),
  });

  if (response.status === 401) {
    // console.log('....401 logout deleteGroup', response);
    await Logout(storageData);
    localStorage.removeItem("token");
    throw new Error("Unauthorized: Logging out user");
  }

  // console.log('....res');
  const data = await response.json();
  // console.log('....data', data);
  return data;
};



export const Confirm = async (password: string) => {
  const storageData = getTokenData();
  const token = storageData?.token;
  // const password = prompt("enter the super admin password");
  const response = await fetch(URL + "/api/users/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      authType: "cms",
      token: token,
    },
    body: JSON.stringify({ password }),
  });

  if (response.status === 401) {
    // console.log('....401 logout Confirm', { response, storageData });
    await Logout(storageData);
    localStorage.removeItem("token");
    // console.log('....', "logout complete Confirm");
    throw new Error("Unauthorized: Logging out user");
  }

  let isConfirmed = await response.json();
  if(isConfirmed){
    localStorage.setItem("admin", JSON.stringify({isConfirmed}));
  }
  return isConfirmed;
};

export const getAdmins = async (isDeleted: any) => {
  const storageData = getTokenData();
  const token = storageData?.token;
  const confirm = await getAdminToken();
  if (!confirm) return;

  const response = await fetch(URL + "/api/users/list/admins", {
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      authType: "cms",
      token: token,
      isDeleted: isDeleted,
    },
  });

  if (response.status === 401) {
    // console.log('....401 logout getAdmins', response);
    await Logout(storageData);
    localStorage.removeItem("token");
    throw new Error("Unauthorized: Logging out user");
  }

  const data = await response.json();
  // console.log('....listadmin', data);
  return data;
};

export const createAdmin = async (values: any) => {
  const storageData = getTokenData();
  const token = storageData?.token;
  const confirm = await getAdminToken();
  if (!confirm) return;

  const response = await fetch(URL + "/api/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      authType: "cms",
      token: token,
    },
    body: JSON.stringify(values),
  });

  if (response.status === 401) {
    // console.log('....401 logout createAdmin', response);
    await Logout(storageData);
    localStorage.removeItem("token");
    throw new Error("Unauthorized: Logging out user");
  }
};

export const editAdmin = async ({ admin, updatedAdmin }: any) => {
  const storageData = getTokenData();
  const token = storageData?.token;
  const confirm = await getAdminToken();
  if (!confirm) return;

  const response = await fetch(URL + "/api/users/" + admin._id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      authType: "cms",
      token: token,
    },
    body: JSON.stringify(updatedAdmin),
  });

  if (response.status === 401) {
    // console.log('....401 logout editAdmin', response);
    await Logout(storageData);
    localStorage.removeItem("token");
    throw new Error("Unauthorized: Logging out user");
  }

  // console.log("Success:", admin);
  // console.log("Success2:", updatedAdmin);
  const data = await response.json();
  return data;
};

export const deleteAdmin = async (admin: any) => {
  const storageData = getTokenData();
  const token = storageData?.token;
  const confirm = await getAdminToken();
  if (!confirm) return;

  const response = await fetch(URL + "/api/users/" + admin._id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      authType: "cms",
      token: token,
    },
    body: JSON.stringify({
      username: admin.username,
      email: admin.email,
      isDeleted: !admin.isDeleted,
    }),
  });

  if (response.status === 401) {
    // console.log('....401 logout deleteAdmin', response);
    await Logout(storageData);
    localStorage.removeItem("token");
    throw new Error("Unauthorized: Logging out user");
  }

  const data = await response.json();
  return data;
};



export const changePassword = async ({ id, password }: any) => {
  const storageData = getTokenData();
  const token = storageData?.token;
  const response = await fetch(URL + "/api/users/changePassword/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      authType: "cms",
      token: token,
    },
    body: JSON.stringify({ id, password }),
  });
  const data = await response.json();
  // console.log('.... ',data);
  return data;
};
