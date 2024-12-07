启动项目步骤:

1. 前往 Neon 网站，可以在 Google 中搜索 “Neon Serverless Postgres”，并在那创建一个账户。

2. 创建一个新项目。在仪表板中会给出一个以 "postgresql://" 开头的长字符串。

3. 在项目根目录下，找到 env 文件，将该字符串粘贴到 DATABASE_URL 变量中。

4. 然后，打开 VS Code 并打开项目文件夹。

5. 打开终端，确保你在项目根目录下，输入 cd "/path_of_the_project"。

6. 输入 npm install 来安装所有依赖项。

7. 接下来，在终端中输入 npm run db:generate，然后输入 npm run db:push 来创建数据库中的表。

8. 现在，输入 npm run dev 可以在本地地址 http://localhost:3000/ 上运行项目。

9. 打开浏览器，访问 http://localhost:3000/