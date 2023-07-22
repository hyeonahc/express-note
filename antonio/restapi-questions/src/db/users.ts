// Q: 이 파일을 계속 schema라고 부르는데 왜그런건가요?
// Q: 그럼 스키마와 모델이 같나요? 스키마는 데이터의 구조와 데이터끼리의 관계를 보여주는 청사진이고 모델은 앱의 데이터구조와 기능을 보여주는 비즈니스 로직이라고 알고 있는데 강의에서는 이 파일을 가리킬때 두 단어를 혼용에서 사용하네요
// Anything under db folder is database schema
// user schema and user model
// Q: 모델 데이터를 encapsulates한다고 하는데 이 파일에서 encapsulates한 부분을 설명해주실 수 있을까요?

// Q: 몽고디비는 데이터를 저장하는 저장소 즉 데이터베이스이고 몽구스는 몽고디비에 있는 데이터를 모델화할때 사용하는 라이브러리가 맞나요?
// This line imports the mongoose module, which is a popular Object Data Modeling (ODM) library for MongoDB in Node.js. It allows us to define and work with schemas and models to interact with the MongoDB database.
import mongoose from 'mongoose'

// Q: 아래 설명을 듣고 스키마가 조금 이해가 되는데 정확히 이해했는지 확인받고 싶어요
// This code defines a MongoDB schema(data blueprint) for the "User" data entity(object or data structure that represents a real-world concept or business object). The schema specifies the structure of the "User" data, including the fields "username," "email," and "authentication."
// Q: 여기서 entity가 뭔가요?
// This code defines a MongoDB schema(data blueprint) for the "User" data entity
// Q: new mongoose.Schema를 사용하면 안에 있는 오브젝트의 스키마가 만들어지는건가요?
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  // Q: password는 username, email과 다르게 왜 authentication 안에 넣나요?
  authentication: {
    // Q: select: false가 어떤의미인지 모르겠습니다
    password: { type: String, required: true, select: false },
    // Q: salt를 사용하면 패스워드가 해쉬가 되기전에 어떤 과정을 해준다는 건가요? 패스워드를 주고받을 때 암호회한다는 건 이해하겠는데 salt라는 부가과정이 이해가 가지 않습니다    // The field "salt" is often used in the context of password *hashing and security. It is a random value that is combined with a user's password before hashing it. This process, known as "salting," adds an extra layer of security to the hashed password
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
})

// Q: 제가 이해하기로는 아래의 코드는 UserModel을 만들어 데이터베이스에 있는 유저관련 데이터를 관리(CRUD) 하는 것 같은데 맞나요? 스키마는 데이터베이스에서 유저관련 데이터가 어떻게 생겼는지 구조를 보여주고 만든 스키마를 사용하여 모델을 만듭니다. 그리고 모델을 사용해 데이터베이스에 저장된 관련 데이터의 CRUD를 할 수 있게 해준다고 생각하는데 맞는지 궁금합니다.
// The model represents a collection in the MongoDB database and provides methods to interact with the "User" collection, such as creating, reading, updating, and deleting user data.
// Q: 아래 설명부분에 대해서 이야기해보고 싶어요
// The first argument 'User' is the name of the collection in the MongoDB database that this model represents. The second argument UserSchema is the schema that defines the structure of the data to be stored in the "User" collection.
export const UserModel = mongoose.model('User', UserSchema)

// Q: 그럼 아래의 코드는 데이터베이스에 저장된 유저관련 데이터를 오퍼레이션하기 위해 만든 액션이 맞나요? 그리고 데이터를 변경할때 사용하는 아래의 함수는 컨트롤러에서만 사용하나요?
export const getUsers = () => UserModel.find()

export const getUserByEmail = (email: string) => UserModel.findOne({ email })

export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    'authentication.sessionToken': sessionToken,
  })

export const getUserById = (id: string) => UserModel.findById(id)

// Q: 왜 values의 타입이 Record<string, any>로 지정되어 있나요?
export const createUser = (values: Record<string, any>) =>
  // Q: 받아온 데이터를 toObject()로 변환해주는 이유는 뭔가요?
  new UserModel(values).save().then(user => user.toObject())

export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id })

export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values)

// Q: 위에 있는 섹션을 크게 정리해서 세가지인데 맞는지 봐주세요
// 1. Create schema (define how the data looks like)
// 2. Turn schema into a model (perform various database operations on the "User" collection)
// 3. Create actions to update model (controller will use these actions and update the model)
