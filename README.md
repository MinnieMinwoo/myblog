# myBlog

- Make my on blog project up [Optimizing existing projects](https://github.com/MinnieMinwoo/myBlog_Frontend)

## Why make same web project?

- This project was re-produced to improve web performance.
- Existing projects have performed all renders on the client.
- As a result, user experience during loading and patching of data was disappointing.
- In this project, Server Side Rendering was used to improve performance by separating server logic from clients.

## Functional differences

- Auth

  - Delete social login
    - Due to problem with user data (including "email") being contaminated when implementing social login using cognito.

- Blog home

  - Full post search capability
    - Search all posts whose search keywords are included in the title, content, or username of the post, as well as the starting point.

- Post read

  - Change to Server Side Rendering

- Post edit & write

  - Introducing Lazy loading to improve initial loading speed

- Setting

  - Delete User Description Modification
    - Integration into About tab

## project stack

- TypeScript
- Next.js
- React-Query
- Bootstrap
- AWS
  - Cognito
  - DynamoDB
  - S3
  - Amplify Hosting
- Jest

## demonstration

[API](https://minnies-organization.gitbook.io/myblog-api/)  
[demonstration Link](https://build.duiyf02ne0kez.amplifyapp.com)
