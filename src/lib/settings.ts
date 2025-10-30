export const ITEMS_PER_PAGE = 5;

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin", "guest"],
  "/student(.*)": ["student", "guest"],
  "/teacher(.*)": ["teacher", "guest"],
  "/parent(.*)": ["parent", "guest"],
  "/list/teachers": ["admin", "teacher", "guest"],
  "/list/students": ["admin", "teacher", "guest"],
  "/list/parents": ["admin", "teacher", "guest"],
  "/list/subjects": ["admin", "guest"],
  "/list/classes": ["admin", "teacher", "guest"],
  "/list/exams": ["admin", "teacher", "student", "parent", "guest"],
  "/list/assignments": ["admin", "teacher", "student", "parent", "guest"],
  "/list/results": ["admin", "teacher", "student", "parent", "guest"],
  "/list/attendance": ["admin", "teacher", "student", "parent", "guest"],
  "/list/events": ["admin", "teacher", "student", "parent", "guest"],
  "/list/announcements": ["admin", "teacher", "student", "parent", "guest"],
};
