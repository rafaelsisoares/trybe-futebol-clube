const noEmail = {
    password: 'password',
};

const noPassword = {
    email: 'email@email.com',
}

const validUser = {
    email: 'email@email.com',
    password: 'password',
}

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjc3NzAwNDUwLCJleHAiOjE2Nzc3ODY4NTB9.yxlkPC7E4ta5RsWz5jAHJfqxZovrsAbwCTjs9-SwewA';

const jwtVerifyMock = {
    id: 1,
    username: 'admin',
    role: 'admin',
    email: 'admin@admin.com'
  }

export {
    noEmail,
    noPassword,
    validUser,
    token,
    jwtVerifyMock,
}