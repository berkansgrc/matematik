import { db } from '@/lib/firebase';
import type { Course } from '@/lib/types';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const coursesCollectionRef = collection(db, 'courses');

export async function getCourses(): Promise<Course[]> {
  try {
    const querySnapshot = await getDocs(coursesCollectionRef);
    const courses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Course));
    return courses;
  } catch (error) {
    console.error("Error fetching courses: ", error);
    return [];
  }
}

export async function getCourse(id: string): Promise<Course | undefined> {
  try {
    const docRef = doc(db, 'courses', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Course;
    } else {
      console.log("No such document!");
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching course: ", error);
    return undefined;
  }
}

export async function addCourse(courseData: Omit<Course, 'id' | 'content'>): Promise<string> {
  try {
    const docRef = await addDoc(coursesCollectionRef, {
        ...courseData,
        content: [], // Ensure new courses have an empty content array
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding course: ", error);
    throw new Error("Kurs eklenemedi.");
  }
}

export async function updateCourse(id: string, courseData: Partial<Course>): Promise<void> {
   try {
    const courseDoc = doc(db, 'courses', id);
    await updateDoc(courseDoc, courseData);
  } catch (error) {
    console.error("Error updating course: ", error);
    throw new Error("Kurs güncellenemedi.");
  }
}
