### Quiz Application APIs
A Secure and Scalable Quiz Application with User Authentication, Quiz Management, and Leaderboard.
#### API Routers and Methods

List all the API routes and HTTP methods used in the project, along with a brief description of what each endpoint does.

#### Quiz Creation and Management:

##### Public Endpoints:

- `/api/v1/quizzes` - `GET`: Get all quizzes

- `/api/v1/quizzes/category/:categoryId` - `GET`: Get quizzes filtered by a specific category.
- `/api/v1/quizzes/search/:keyword` - `GET`: Search quizzes by title or description using a keyword.

##### Private Endpoints:

- `/api/v1/quizzes` - `POST`: Create a new quiz
- `/api/v1/quizzes/:quizId` - `PUT`: Update quiz properties
- `/api/v1/quizzes/:quizId` - `DELETE`: Delete quiz properties

- `/api/v1/quizzes/:quizId/questions` - `POST`: Add a new question to a quiz

- `/api/v1/quizzes/:quizId/questions/:questionId` - `PUT`: Update a question in a quiz
- `/api/v1/quizzes/:quizId/questions/:questionId` - `DELETE`: Delete a question from a quiz

- `/api/v1/tasks/item/:taskID` - `GET`: Get a single task

- `/api/v1/tasks` - `POST`: Create a new task
- `/api/v1/tasks/:taskID` - `GET`: Mark the task as completed

#### Quiz Taking:

##### Private Endpoints:

- `/api/v1/quizzes/:quizId/results` - `GET`: Get quiz results

- `/api/v1/quizzes/:quizId/submit` - `POST`: Submit the user's answers for a specific quiz.

#### Quiz Leaderboard:

##### Public Endpoints:

- `/api/v1/leaderboard/` - `GET`: Get Overall Leaderboard

##### Private Endpoints:

- `/api/v1/leaderboard/:quizId` - `GET`: Get the leaderboard for a specific quiz, displaying the highest scoring users.

#### Quiz Categories:

##### Public Endpoints:

- `/api/v1/category/` - `GET`: Get all category

##### Private Endpoints:

- `/api/v1/category/` - `POST`: Create a new category

- `/api/v1/category/:categoryID` - `PUT`: Update category

- `/api/v1/category/:categoryID` - `DELETE`: Delete category

#### User Authentication:

##### Public Endpoints:

- `/api/v1/users/register` - `POST`: Register new user

- `/api/v1/users/login` - `POST`: Authenticate a user

##### Private Endpoints:

- `/api/v1/users/logout` - `POST`: Logs out the currently logged-in user by invalidating the JWT token.

- `/api/v1/users/me` - `GET`: Get user data

Author: Hossain Chisty <br>
Email: hossain.chisty11@gmail.com <br>
Github: https://github.com/hossainchisty
