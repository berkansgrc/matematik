import { db } from '@/lib/firebase';
import type { Course, VideoContent } from '@/lib/types';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const coursesCollectionRef = collection(db, 'courses');

export async function getCourses(): Promise<Course[]> {
  try {
    const q = query(coursesCollectionRef, orderBy('title'));
    const querySnapshot = await getDocs(q);
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

export async function addCourse(courseData: Omit<Course, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(coursesCollectionRef, courseData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding course: ", error);
    throw new Error("Kurs eklenemedi.");
  }
}

export async function updateCourse(id: string, courseData: Partial<Omit<Course, 'id'>>): Promise<void> {
   try {
    const courseDoc = doc(db, 'courses', id);
    await updateDoc(courseDoc, courseData);
  } catch (error) {
    console.error("Error updating course: ", error);
    throw new Error("Kurs güncellenemedi.");
  }
}

export async function deleteCourse(id: string): Promise<void> {
  try {
    const courseDoc = doc(db, 'courses', id);
    await deleteDoc(courseDoc);
  } catch (error) {
    console.error("Error deleting course: ", error);
    throw new Error("Kurs silinemedi.");
  }
}


export async function getRecentVideos(limit: number = 6): Promise<VideoContent[]> {
  try {
    const courses = await getCourses();
    const allVideos: VideoContent[] = [];

    courses.forEach(course => {
      if (course.content) {
        course.content
          .filter(item => item.type === 'youtube')
          .forEach(video => {
            allVideos.push({
              ...video,
              courseId: course.id,
              category: course.category
            });
          });
      }
    });

    // Sort videos by ID in descending order (assuming ID is 'content-TIMESTAMP')
    allVideos.sort((a, b) => {
      const timeA = parseInt(a.id.split('-')[1] || '0', 10);
      const timeB = parseInt(b.id.split('-')[1] || '0', 10);
      return timeB - timeA;
    });

    return allVideos.slice(0, limit);
  } catch (error) {
    console.error("Error fetching recent videos: ", error);
    return [];
  }
}
