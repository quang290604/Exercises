const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

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
  const db = client.db('student_manager');
  const collection = db.collection('students');

  const student = {
    studentCode: 'SV005',
    fullName: 'Nguyen Van A',
    gender: 'Male',
    dateOfBirth: '2003-05-12',
    email: 'a.nguyen@example.com',
    major: 'Software Engineering',
    year: 4,
    gpa: 3.7,
  };

  const created = await createStudent(collection, student);
  console.log('Created student:', created);

  const students = await getStudents(collection);
  console.log('Students:', students);

  const updated = await updateStudent(collection, created._id.toString(), {
    fullName: 'Nguyen Van A Updated',
    gpa: 3.9,
  });
  console.log('Updated student:', updated);

  const deleted = await deleteStudent(collection, created._id.toString());
  console.log('Deleted student:', deleted);
}

main().catch((error) => console.error(error)).finally(() => client.close());
