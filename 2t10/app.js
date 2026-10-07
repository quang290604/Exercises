const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'student_manager';

async function createStudent(collection, student) {
  const result = await collection.insertOne(student);
  return {
    _id: result.insertedId,
    ...student,
  };
}

async function getStudents(collection) {
  return await collection.find({}).toArray();
}

async function updateStudent(collection, studentId, updates) {
  const result = await collection.updateOne(
    { _id: new ObjectId(studentId) },
    { $set: updates }
  );
  return result;
}

async function deleteStudent(collection, studentId) {
  const result = await collection.deleteOne({
    _id: new ObjectId(studentId),
  });
  return result;
}

async function main() {
  await client.connect();
  console.log('Connected successfully to server');

  const db = client.db(dbName);
  const collection = db.collection('students');

  const students = [
    {
      studentCode: 'SV001',
      fullName: 'Tran Thi Binh',
      gender: 'Female',
      dateOfBirth: '2004-07-22',
      email: 'binh.tran@example.com',
      major: 'Information Technology',
      year: 3,
      gpa: 3.65,
    },
    {
      studentCode: 'SV002',
      fullName: 'Le Minh Cuong',
      gender: 'Male',
      dateOfBirth: '2005-01-10',
      email: 'cuong.le@example.com',
      major: 'Computer Science',
      year: 2,
      gpa: 3.1,
    },
    {
      studentCode: 'SV004',
      fullName: 'Pham Thu Ha',
      gender: 'Female',
      dateOfBirth: '2005-09-05',
      email: 'ha.pham@example.com',
      major: 'Business Administration',
      year: 2,
      gpa: 3.45,
    },
  ];

  const created = await collection.insertMany(students);
  console.log('Created students:', created.insertedCount);

  const allStudents = await getStudents(collection);
  console.log('All students:', allStudents);

  const firstStudentId = created.insertedIds[0].toString();
  const updated = await updateStudent(collection, firstStudentId, {
    fullName: 'Tran Thi Binh Updated',
    gpa: 3.9,
  });
  console.log('Updated result:', updated);

  const deleted = await deleteStudent(collection, firstStudentId);
  console.log('Deleted result:', deleted);

  return 'CRUD completed successfully.';
}

main()
  .then(console.log)
  .catch((error) => console.error('Error:', error))
  .finally(() => client.close());
