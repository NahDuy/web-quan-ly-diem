const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          parsed = body;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });
    req.on('error', reject);
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING AUTOMATED END-TO-END API TEST ===\n');
  const results = [];

  // 1. Login
  console.log('[TEST 1] POST /api/v1/auth/login');
  const loginRes = await request({
    hostname: 'localhost',
    port: 80,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { username: 'admin', password: 'password123' });

  console.log(`Status: ${loginRes.status}`);
  if (loginRes.status !== 200 || !loginRes.body.token) {
    console.error('Login FAILED:', loginRes.body);
    process.exit(1);
  }
  const token = loginRes.body.token;
  console.log('Token acquired successfully.\n');
  results.push({ test: '1. Auth Login', status: loginRes.status, passed: true });

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // 2. Auth Me
  console.log('[TEST 2] GET /api/v1/auth/me');
  const meRes = await request({
    hostname: 'localhost',
    port: 80,
    path: '/api/v1/auth/me',
    method: 'GET',
    headers: authHeaders
  });
  console.log(`Status: ${meRes.status}, User: ${meRes.body.fullName} (${meRes.body.roleCode})`);
  results.push({ test: '2. Auth Me', status: meRes.status, passed: meRes.status === 200 });

  // 3. Get Class 1 Matrix
  console.log('\n[TEST 3] GET /api/v1/classes/1/matrix?semester=1');
  const matrixRes = await request({
    hostname: 'localhost',
    port: 80,
    path: '/api/v1/classes/1/matrix?semester=1',
    method: 'GET',
    headers: authHeaders
  });
  const firstSubjectId = matrixRes.body.columns?.[0]?.subjectId || 3;
  console.log(`Status: ${matrixRes.status}, Class: ${matrixRes.body.className}, Rows: ${matrixRes.body.rows?.length}, Columns: ${matrixRes.body.columns?.length}, First Subject: ${firstSubjectId}`);
  results.push({ test: '3. Get Class Matrix', status: matrixRes.status, passed: matrixRes.status === 200 });

  // 4. Bulk Update Matrix (Scores + Evaluations + Reason for Audit)
  console.log('\n[TEST 4] POST /api/v1/classes/1/matrix/bulk-update');
  const bulkRes = await request({
    hostname: 'localhost',
    port: 80,
    path: '/api/v1/classes/1/matrix/bulk-update',
    method: 'POST',
    headers: authHeaders
  }, {
    semester: 1,
    reason: 'Cập nhật điểm phúc khảo và rèn luyện đợt 1 năm 2026',
    gradeUpdates: [
      { studentId: 1, subjectId: firstSubjectId, score: 8.75 }
    ],
    evaluationUpdates: [
      { studentId: 1, conductGrade: 'TOT', scorePolitical: 8.5, scoreMilitary: 9.0, scoreSpecialty: 8.5 }
    ]
  });
  console.log(`Status: ${bulkRes.status}, Body:`, bulkRes.body);
  results.push({ test: '4. Bulk Update Matrix & Audit Log', status: bulkRes.status, passed: bulkRes.status === 200 });

  // 5. Verify updated matrix
  console.log('\n[TEST 5] Verify Matrix Data Persistence');
  const checkMatrixRes = await request({
    hostname: 'localhost',
    port: 80,
    path: '/api/v1/classes/1/matrix?semester=1',
    method: 'GET',
    headers: authHeaders
  });
  const row1 = checkMatrixRes.body.rows?.find(r => r.studentId === 1);
  const updatedScore = row1?.grades?.[String(firstSubjectId)]?.score;
  const updatedConduct = row1?.conductGrade;
  const polScore = row1?.gradExamScores?.['101'];
  console.log(`Student 1 Subject ${firstSubjectId} Score: ${updatedScore} (expected 8.75), Conduct: ${updatedConduct} (expected TOT), Grad Exam 101: ${polScore} (expected 8.5)`);
  results.push({ test: '5. Verify Matrix Persistence', status: checkMatrixRes.status, passed: updatedScore === 8.75 && updatedConduct === 'TOT' && polScore === 8.5 });

  // 6. Lock Class Matrix
  console.log('\n[TEST 6] POST /api/v1/classes/1/lock?semester=1');
  const lockRes = await request({
    hostname: 'localhost',
    port: 80,
    path: '/api/v1/classes/1/lock?semester=1',
    method: 'POST',
    headers: authHeaders
  });
  console.log(`Status: ${lockRes.status}, Message:`, lockRes.body.message);
  results.push({ test: '6. Lock Matrix', status: lockRes.status, passed: lockRes.status === 200 });

  // 7. Unlock Class Matrix
  console.log('\n[TEST 7] POST /api/v1/classes/1/unlock?semester=1');
  const unlockRes = await request({
    hostname: 'localhost',
    port: 80,
    path: '/api/v1/classes/1/unlock?semester=1',
    method: 'POST',
    headers: authHeaders
  });
  console.log(`Status: ${unlockRes.status}, Message:`, unlockRes.body.message);
  results.push({ test: '7. Unlock Matrix', status: unlockRes.status, passed: unlockRes.status === 200 });

  // 8. Add Flexible Subject to Class
  console.log('\n[TEST 8] POST /api/v1/classes/1/add-subject?subjectId=2&semester=1&isExtra=true');
  const addSubRes = await request({
    hostname: 'localhost',
    port: 80,
    path: '/api/v1/classes/1/add-subject?subjectId=2&semester=1&isExtra=true',
    method: 'POST',
    headers: authHeaders
  });
  console.log(`Status: ${addSubRes.status}, Message:`, addSubRes.body.message);
  results.push({ test: '8. Add Subject to Class', status: addSubRes.status, passed: addSubRes.status === 200 });

  // 9. Get Students List
  console.log('\n[TEST 9] GET /api/v1/students?classId=1');
  const studentsRes = await request({
    hostname: 'localhost',
    port: 80,
    path: '/api/v1/students?classId=1',
    method: 'GET',
    headers: authHeaders
  });
  console.log(`Status: ${studentsRes.status}, Student count: ${studentsRes.body?.length}`);
  results.push({ test: '9. Get Students', status: studentsRes.status, passed: studentsRes.status === 200 });

  // 10. Create Student
  console.log('\n[TEST 10] POST /api/v1/students');
  const randomCode = 'TEST' + Math.floor(Math.random() * 90000 + 10000);
  const createStudentRes = await request({
    hostname: 'localhost',
    port: 80,
    path: '/api/v1/students',
    method: 'POST',
    headers: authHeaders
  }, {
    studentCode: randomCode,
    fullName: 'Học viên Thử Nghiệm Tự Động',
    dob: '15/08/2003',
    pob: 'Hải Phòng',
    gender: 'Nam',
    rank: 'Hạ sĩ',
    classId: 1
  });
  console.log(`Status: ${createStudentRes.status}, Created Student:`, createStudentRes.body.studentCode, createStudentRes.body.fullName);
  results.push({ test: '10. Create Student', status: createStudentRes.status, passed: createStudentRes.status === 200 });

  // 11. Delete Created Student
  if (createStudentRes.body?.id) {
    console.log(`\n[TEST 11] DELETE /api/v1/students/${createStudentRes.body.id}`);
    const deleteStudentRes = await request({
      hostname: 'localhost',
      port: 80,
      path: `/api/v1/students/${createStudentRes.body.id}`,
      method: 'DELETE',
      headers: authHeaders
    });
    console.log(`Status: ${deleteStudentRes.status}, Message:`, deleteStudentRes.body?.message);
    results.push({ test: '11. Delete Student', status: deleteStudentRes.status, passed: deleteStudentRes.status === 200 });
  }

  // 12. Dashboard Summary
  console.log('\n[TEST 12] GET /api/v1/dashboard/summary');
  const dashRes = await request({
    hostname: 'localhost',
    port: 80,
    path: '/api/v1/dashboard/summary',
    method: 'GET',
    headers: authHeaders
  });
  console.log(`Status: ${dashRes.status}, Total Classes: ${dashRes.body?.totalClasses}, Total Students: ${dashRes.body?.totalStudents}`);
  results.push({ test: '12. Dashboard Summary', status: dashRes.status, passed: dashRes.status === 200 });

  // 13. Audit Logs
  console.log('\n[TEST 13] GET /api/v1/audit-logs/grades?page=0&size=15');
  const auditRes = await request({
    hostname: 'localhost',
    port: 80,
    path: '/api/v1/audit-logs/grades?page=0&size=15',
    method: 'GET',
    headers: authHeaders
  });
  console.log(`Status: ${auditRes.status}, Total Audit Logs: ${auditRes.body?.totalElements}`);
  if (auditRes.body?.content?.length > 0) {
    console.log(`Latest Audit Log Reason: "${auditRes.body.content[0].reason}", Modified By: ${auditRes.body.content[0].modifiedByUsername}`);
  }
  results.push({ test: '13. Audit Logs', status: auditRes.status, passed: auditRes.status === 200 });

  // 14. Curriculum Progress
  console.log('\n[TEST 14] GET /api/v1/curriculums/progress/class/1');
  const curRes = await request({
    hostname: 'localhost',
    port: 80,
    path: '/api/v1/curriculums/progress/class/1',
    method: 'GET',
    headers: authHeaders
  });
  console.log(`Status: ${curRes.status}, Course: ${curRes.body?.courseName}, Total Subjects: ${curRes.body?.totalSubjects}`);
  results.push({ test: '14. Curriculum Progress', status: curRes.status, passed: curRes.status === 200 });

  // 15. Export Excel
  console.log('\n[TEST 15] GET /api/v1/classes/1/export-excel?semester=1');
  const excelRes = await request({
    hostname: 'localhost',
    port: 80,
    path: '/api/v1/classes/1/export-excel?semester=1',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(`Status: ${excelRes.status}, Content-Type: ${excelRes.headers['content-type']}`);
  results.push({ test: '15. Export Excel', status: excelRes.status, passed: excelRes.status === 200 });

  console.log('\n================ TEST SUMMARY ================');
  let allPassed = true;
  results.forEach(r => {
    const symbol = r.passed ? '✓ PASS' : '✗ FAIL';
    console.log(`${symbol} [${r.status}] ${r.test}`);
    if (!r.passed) allPassed = false;
  });

  if (allPassed) {
    console.log('\n>>> ALL 15 API ENDPOINTS TESTED & PASSED WITH 200 OK (NO 500 ERRORS)! <<<');
  } else {
    console.log('\n>>> SOME TESTS FAILED! <<<');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
