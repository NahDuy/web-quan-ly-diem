# Frontend Architecture

Tài liệu này mô tả kiến trúc frontend hiện tại của `dblab-web` theo source code thực tế. Mục tiêu là dùng làm khuôn tham chiếu khi triển khai một dự án khác có cấu trúc và hành vi tương tự.

## 1. Tổng Quan

Frontend này là một ứng dụng React + TypeScript chạy trên Vite, tổ chức theo hướng feature-based. Điểm đáng chú ý nhất là toàn bộ routing được gom vào một router trung tâm trong `src/App.tsx`, còn shell layout, auth guard, breadcrumb, route-role mapping, token management và i18n được tách ra các lớp riêng để dùng xuyên suốt ứng dụng.

Các đặc trưng chính:

- Bootstrap app ở `src/main.tsx`.
- Router trung tâm ở `src/App.tsx`.
- Shell layout chính ở `src/layouts/MainLayout.tsx`.
- Auth và permission guard ở `src/components/auth/auth-route-guard.tsx`.
- User state, route config, breadcrumb là các context toàn cục.
- API client và token manager nằm ở `src/lib`.
- Feature pages nằm trong `src/app`.
- Shared UI và dashboard shell nằm trong `src/components`.

## 2. Cấu Trúc Thư Mục Thực Tế

Đây là cấu trúc hiện có của frontend, rút gọn theo các phần có ý nghĩa kiến trúc:

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── App.css
├── i18n/
├── layouts/
│   └── MainLayout.tsx
├── contexts/
│   ├── UserContext.tsx
│   ├── RouteConfigContext.tsx
│   └── BreadcrumbProvider.tsx
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── layout/
│   ├── theme/
│   └── ui/
├── hooks/
├── lib/
│   ├── api.ts
│   ├── token-manager.ts
│   ├── toast.ts
│   ├── websocket.ts
│   └── ...
├── services/
│   ├── authService.ts
│   ├── assignmentService.ts
│   ├── courseService.ts
│   └── ...
├── app/
│   ├── auth/
│   ├── home/
│   ├── exercise/
│   ├── editor/
│   ├── history/
│   ├── profile/
│   ├── rank/
│   ├── contest/
│   ├── contest-editor/
│   ├── contest-joined/
│   ├── contest-waiting/
│   ├── exam/
│   ├── assignment/
│   ├── course/
│   ├── teacher/
│   ├── question-category/
│   ├── subject/
│   ├── semester/
│   ├── doc-agent/
│   ├── doc-agent-session/
│   ├── model-config/
│   ├── feedback/
│   ├── grades/
│   ├── module/
│   ├── thesis/
│   └── manage-user/
└── styles/
```

## 3. Bootstrap Và Luồng Khởi Động

### 3.1 `src/main.tsx`

`main.tsx` là entry point của ứng dụng. Luồng khởi động hiện tại:

1. Fix biến global cho `sockjs-client` nếu môi trường thiếu `global`.
2. Nạp `i18n`.
3. Gọi `TokenManager.initializeFromCookies()` để đồng bộ token từ cookie sang localStorage.
4. Render app trong `React.StrictMode`.
5. Bọc toàn bộ app bằng `ThemeProvider`.
6. Gắn `Toaster` ở cấp cao nhất.

Ý nghĩa kiến trúc:

- Theme và toast là global concerns.
- Token được đồng bộ sớm trước khi router và guard chạy.
- i18n được load ở startup để các component dùng translation ngay từ đầu.

### 3.2 `src/App.tsx`

`App.tsx` là trung tâm điều phối của toàn bộ frontend. File này làm 4 việc chính:

- Set document title theo `VITE_APP_TITLE` và `i18next`.
- Khởi tạo stack provider toàn cục.
- Khai báo toàn bộ routes.
- Phân loại route theo public/protected và theo role khi cần.

Provider stack hiện tại:

1. `UserProvider`
2. `BrowserRouter`
3. `BreadcrumbProvider`
4. `RouteConfigProvider`
5. `Routes`

Điều này có nghĩa là user state và route metadata được chuẩn bị trước khi vào route tree.

## 4. Mô Hình Routing

### 4.1 Tổng Quan

Routing được khai báo tập trung trong `src/App.tsx`, không tách route manifest riêng. Đây là một router lớn, dễ đọc theo kiểu “một nơi nhìn hết”, nhưng nếu dự án mở rộng lớn hơn thì sẽ khó chia nhỏ.

### 4.2 Nhóm Route

#### Public routes

- `/login`
- `/register`

Hai route này vẫn đi qua `AuthRouteGuard`, nhưng `requireAuth={false}` để tránh redirect ngược.

#### Protected routes

Các route còn lại phần lớn require auth và được bọc bằng `MainLayout`, ví dụ:

- `/`
- `/home`
- `/exercise`
- `/question-detail/:questionId`
- `/history`
- `/rank`
- `/contest`
- `/profile`
- `/student/assignments`
- `/exam/*`
- `/assignments/*`
- `/questions/*`
- `/courses/*`
- `/student/courses/*`
- `/doc-agent/*`
- `/model-config`
- `/feedback`
- `/module`
- `/grades`
- `/thesis/*`
- `/manage-users`
- `/subjects`
- `/question-categories`
- `/semesters`

#### Special routes

- Contest flow có route riêng cho waiting, joined, editor.
- Exam flow có cả student flow và teacher flow.
- Thesis có router điều hướng theo role.
- Course/class có route riêng cho teacher và student.
- Một số route dùng `RoleContext.Provider` để truyền ngữ cảnh role vào component con.

### 4.3 Pattern của route element

Mẫu chung của một protected route là:

```tsx
<AuthRouteGuard requireAuth={true}>
  <MainLayout>
    <Page />
  </MainLayout>
</AuthRouteGuard>
```

Nếu route không cần shell layout, component sẽ được render trực tiếp bên trong guard.

## 5. Layout Shell

### 5.1 `src/layouts/MainLayout.tsx`

`MainLayout` là shell cho hầu hết các route sau khi đăng nhập. Nó gồm:

- `SidebarProvider`
- `AppSidebar`
- `SiteHeader`
- `SidebarInset`
- `main`

Điểm đáng chú ý là layout có logic tự động điều khiển sidebar theo route:

- Khi vào editor hoặc contest joined, sidebar bị thu lại.
- Khi rời khỏi các route đó, sidebar mở lại.
- Nếu user đã thao tác thủ công, auto-control sẽ tạm dừng để không ghi đè hành vi người dùng.

### 5.2 Ý nghĩa khi port sang dự án khác

Nếu tái dùng kiến trúc này, nên giữ 3 lớp rõ ràng:

1. App shell cấp toàn cục.
2. Sidebar/header shell cho protected area.
3. Page content ở cấp route.

## 6. Auth, Token Và Permission

### 6.1 `src/components/auth/auth-route-guard.tsx`

Guard hiện tại làm hai việc tách biệt:

1. Kiểm tra token hợp lệ.
2. Kiểm tra quyền route theo mapping từ backend.

Guard có cơ chế:

- Không check quá thường xuyên.
- Né redirect trong lúc refresh token.
- Đọc token từ `TokenManager`.
- Nghe thay đổi `storage` để phát hiện đăng xuất từ tab khác.
- Nếu token hết hạn thì toast lỗi và điều hướng về `/login`.

### 6.2 `src/contexts/UserContext.tsx`

User được bootstrap từ access token sau khi app load.

Luồng hiện tại:

1. Lấy access token từ `TokenManager`.
2. Decode token.
3. Tạo object user từ claims trong token.
4. Đưa user vào context.

Context này cung cấp:

- `user`
- `userId`
- `loading`
- `setUser`
- `logout`

Điểm quan trọng là user state không fetch lại từ backend ở startup; nó được dựng từ token claim.

### 6.3 `src/contexts/RouteConfigContext.tsx`

Context này tải mapping route -> roles từ API và lưu vào `routeRoles`.

Mục đích:

- Cho guard biết route nào cần role nào.
- Tách quyền truy cập khỏi component page.

### 6.4 `src/lib/token-manager.ts`

Token manager là lớp trung tâm cho auth state:

- Lưu token vào localStorage.
- Đồng bộ token với cookie domain-wide.
- Hỗ trợ refresh token.
- Có cờ `isRefreshing` để tránh refresh trùng lặp.
- Hỗ trợ initialize từ cookie lúc app start.

Đây là một lớp rất quan trọng nếu muốn port sang dự án khác, vì nó quyết định cách frontend giữ session.

## 7. Breadcrumb Và Metadata Theo Route

### `src/contexts/BreadcrumbProvider.tsx`

Breadcrumb được sinh tự động theo pathname, nhưng có override cho các route phức tạp.

Mô hình hiện tại:

- Với route đơn giản, breadcrumb được build từ các segment URL.
- Với route đặc biệt như exam, assignment, contest, thesis, doc-agent, breadcrumb được map thủ công.
- Tên hiển thị phụ thuộc vào translation key từ `common` namespace.

Ý nghĩa:

- Không cần cấu hình breadcrumb ở từng page đơn giản.
- Các route sâu vẫn có breadcrumb đúng ngữ cảnh.

## 8. Data Layer Và API

### 8.1 `src/lib/api.ts`

Đây là nơi chứa API client và các hằng cấu hình backend:

- `VITE_API_BASE_URL`
- `VITE_AUTH_URL`
- `VITE_MCS_URL`
- `VITE_ASSIGNMENT_URL`

File này cũng chứa nhiều type và helper dùng chung cho domain API.

### 8.2 `src/services/`

`services` là lớp gọi API theo domain. Một số service quan trọng:

- `authService.ts`
- `assignmentService.ts`
- `courseService.ts`
- `examService.ts`
- `docAgentService.ts`
- `enrollmentService.ts`

Pattern chung:

- Dùng client ở `lib/api.ts`.
- Domain hóa theo feature.
- Không để page gọi fetch trực tiếp nếu có thể tránh.

### 8.3 `src/services/authService.ts`

Auth service xử lý:

- Login.
- Login qua PTIT/QLDT.
- Login qua Google.
- Register.
- Logout.
- Refresh token.
- Lấy thông tin user.
- Link/unlink provider.
- Lấy danh sách user/students/teachers.

## 9. Hook Layer

### `src/hooks/`

Hook layer hiện là tập hợp các custom hook theo feature, ví dụ:

- auth
- assignment
- exam
- question
- semester
- subject
- schedule
- submission
- profile
- websocket

File `src/hooks/index.ts` đang đóng vai trò barrel export cho một số hook. Khi port sang dự án khác, nên giữ thói quen export theo feature để import ổn định và ít phụ thuộc đường dẫn.

## 10. Feature Domains

### 10.1 Student flow

Các màn dành cho học viên gồm:

- Home
- Exercise
- Question detail / editor
- History
- Profile
- Rank
- Student assignments
- Student exams
- Student courses
- Feedback
- Grades

### 10.2 Teacher/Admin flow

Các màn dành cho giảng viên hoặc admin gồm:

- Assignment list, create, edit, grading
- Exam list, create, update, grading, statistics
- Question management
- Course/class management
- Subject management
- Category management
- Semester management
- Manage users
- Model config

### 10.3 Contest flow

Contest có 3 mảng:

- Contest list
- Contest waiting
- Contest joined
- Contest editor trong contest

### 10.4 Thesis flow

Thesis được chia theo vai trò:

- Student
- Advisor/Lecturer
- Department
- Report

### 10.5 Doc Agent flow

Có một module riêng cho doc-agent và session của doc-agent.

## 11. Shared UI Và Component Tổ Chức

### `src/components/`

Thư mục này chứa phần tái sử dụng lớn nhất của app.

#### `components/ui`

Bộ primitive UI kiểu shadcn hoặc tương đương, ví dụ:

- button
- dialog
- dropdown
- sidebar
- form
- table
- toast
- breadcrumb

#### `components/dashboard`

Shell UI cho phần dashboard:

- app sidebar
- site header
- nav items
- user menu

#### `components/layout`

Component hỗ trợ layout trang, ví dụ `PageWrapper`.

#### Domain-specific components

Các thư mục như `assignment`, `contest`, `course`, `exam`, `teacher`, `thesis`, `profile`, `feedback`, `question-category`, `rank`, `semester`, `subject` chứa các component gắn với từng domain.

## 12. i18n, Theme Và Global UI

### i18n

`src/i18n` được khởi tạo ngay từ `main.tsx`. App dùng translation cho title, breadcrumb và nhiều label giao diện.

### Theme

`ThemeProvider` bọc toàn bộ app ở cấp root, với `defaultTheme=system` và `enableSystem`.

### Toast

`Toaster` được mount ở root để các màn hình có thể bắn toast toàn cục.

## 13. Conventions Nên Giữ Khi Port Sang Dự Án Khác

1. Giữ router trung tâm nếu dự án cần kiểm soát route tập trung và có nhiều role/flow.
2. Tách shell layout khỏi page content.
3. Giữ lớp auth guard độc lập với page.
4. Tách route-role mapping khỏi component để có thể đổi quyền từ backend.
5. Dùng token manager để đồng bộ localStorage và cookie nếu cần session dùng chung subdomain.
6. Dùng breadcrumb auto-generation cho route đơn giản, override cho route phức tạp.
7. Tách service theo domain thay vì một file API khổng lồ.
8. Giữ i18n và theme ở cấp root.

## 14. Những Điểm Cần Lưu Ý Khi Triển Khai Lại

- `PROJECT_STRUCTURE.md` hiện là tài liệu định hướng, không phản ánh hoàn toàn cây thư mục thật.
- Một số route và component đang được gom trực tiếp trong `App.tsx`, nên nếu port sang dự án mới có thể tách dần thành route config riêng.
- `RouteConfigContext` và `AuthRouteGuard` đang phụ thuộc backend trả về mapping quyền.
- `TokenManager` có hành vi cookie/localStorage khá cụ thể, nên nếu đổi domain hoặc auth strategy thì cần chỉnh lại sớm.
- `MainLayout` có auto sidebar theo route, đây là behavior gắn chặt với editor và contest joined.

## 15. Gợi Ý Cấu Trúc Tối Thiểu Cho Dự Án Mới

Nếu muốn triển khai dự án mới theo pattern này, cấu trúc tối thiểu nên có:

```text
src/
├── app/
├── components/
├── contexts/
├── hooks/
├── layouts/
├── lib/
├── services/
├── styles/
├── i18n/
├── main.tsx
└── App.tsx
```

Phần quan trọng nhất là giữ được 5 lớp sau:

1. Bootstrap root.
2. Router trung tâm.
3. Layout shell.
4. Auth and permission guard.
5. Service/token/data layer.

## 16. Kết Luận

Kiến trúc hiện tại của `dblab-web` là một frontend React có tính hệ thống cao, dựa trên router trung tâm, provider stack toàn cục, service layer theo domain và shell layout thống nhất. Nếu mang sang dự án khác, nên ưu tiên giữ các hành vi nền như token sync, auth guard, route-role mapping và breadcrumb auto-generation, vì đó là các phần quyết định trải nghiệm và khả năng mở rộng của app.