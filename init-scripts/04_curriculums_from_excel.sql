-- CLEANUP VÀ NẠP LẠI TOÀN BỘ MÔN HỌC & LỘ TRÌNH ĐÀO TẠO CHUẨN XÁC 100%
BEGIN;

-- 1. Làm sạch curriculum_subjects và curriculums
DELETE FROM curriculum_subjects;
DELETE FROM curriculums;

-- 3. Chèn các môn học sạch, chuẩn tên tiếng Việt quân sự
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_VATCANHLTLBOI', 'Vật cản HLTL + Bơi', 3, 7) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_KIENTHUCCOSOTH', 'Kiến thức cơ sở Thông tin VTĐ', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_THIIENAIVTSONG', 'Thi Điện đài VTĐ sóng cực ngắn', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_IENAIVTSCNVRU8', 'Điện đài VTĐ SCN VRU-812; 812/S', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_MAYTHUPHATABAN', 'Máy thu phát đa băng tần VRP-712/S', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_MAYTHUPHATVRH8', 'Máy thu phát VRH-811/A; 811/S, 911', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_BANAK2BANNGAY', 'Bắn AK-2 ban ngày', 3, 7) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_IEULENHQUANSU', 'Điều lệnh Quân sự', 3, 7) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_KIENTHUCNHUNGV', 'Kiến thức những vấn đề chung TT VTĐ', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_NGHIEPVUTHONGT', 'Nghiệp vụ thông tin VTĐ', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_KIEMTRAKHXHNVP', 'Kiểm tra KHXH&NV Phần 1', 3, 8) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_CHIENTHUATCHUY', 'Chiến thuật chuyên ngành', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_KIEMTRAKHXHNVP_2', 'Kiểm tra KHXH&NV Phần 2', 3, 8) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_GIAODUCCHINHTR', 'Giáo dục Chính trị', 2, 8) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_KYCHIENTHUATBO', 'Kỹ - Chiến thuật Bộ binh', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('HTD_KIENTHUCCOSOTH', 'Kiến thức cơ sở Thông tin HTĐ', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('HTD_KIENTHUCCHUYEN', 'Kiến thức chuyên ngành thiết bị TT HTĐ', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('HTD_NGHIEPVUTHONGT', 'Nghiệp vụ Thông tin HTĐ', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('HTD_CHIENTHUATCHUY', 'Chiến thuật chuyên ngành TT HTĐ', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_GIAIPHAUSINHLY', 'Giải phẫu sinh lý', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_DUOCLYTHUOCTHU', 'Dược lý & Thuốc thường dùng', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_IEUDUONGCOBAN', 'Điều dưỡng cơ bản', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_BENHNOIKHOA', 'Bệnh nội khoa', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_5KYTHUATCAPCUU', '5 kỹ thuật cấp cứu chiến thương', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_VESINHPHONGDIC', 'Vệ sinh phòng dịch', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_BENHNGOAIKHOA', 'Bệnh ngoại khoa', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_TOCHUCCHIENTHU', 'Tổ chức chiến thuật quân y', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_HAUCANKYTHUAT', 'Hậu cần & Kỹ thuật', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_YHOCCOTRUYEN', 'Y học cổ truyền', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_THUCTAPBENHVIE', 'Thực tập bệnh viện', 4, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_KIENTHUCCOSOSU', 'Kiến thức cơ sở Súng Đại liên', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_BANAILIENBAI3B', 'Bắn Đại liên Bài 3 ban đêm', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_BANAILIENBAI1B', 'Bắn Đại liên Bài 1 ban ngày', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_BANAILIENBAI3B_2', 'Bắn Đại liên Bài 3 ban ngày', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_BANMUCTIEUTREO', 'Bắn mục tiêu treo tại chỗ Bài 1 KĐ Đại liên', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_CHIENTHUATALCH', 'Chiến thuật aĐL chi viện bBB tiến công, phòng ngự', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_CHIENTHUATALCH_2', 'Chiến thuật aĐL chi viện cBB tiến công, phòng ngự', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_PHUONGPHAPDUYT', 'Phương pháp duy trì luyện tập bắn Đại liên', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_KIENTHUCCOSOSU', 'Kiến thức cơ sở Súng Cối 60mm', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_BANCOI60MMBAI1', 'Bắn Cối 60mm Bài 1', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_BAI2BANCOICHUA', 'Bài 2: Bắn cối chuẩn bị gấp ban đêm', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_BAI3BANGIANTIE', 'Bài 3: Bắn gián tiếp ban ngày', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_PHUONGPHAPDUYT', 'Phương pháp duy trì luyện tập bắn Cối 60mm', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_BAIBANUNGDUNGA', 'Bài bắn ứng dụng đạn huấn luyện', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_CHIENTHUATCOI6', 'Chiến thuật Cối 60 chi viện bBB tiến công, phòng ngự', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_CHIENTHUATCOI6_2', 'Chiến thuật Cối 60 chi viện cBB tiến công, phòng ngự', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_KIENTHUCCOSO', 'Kiến thức cơ sở', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_IAHINHQUANSU', 'Địa hình Quân sự', 3, 7) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_BINHKHISUNGBOB', 'Binh khí súng Bộ binh', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_BINHKHICOIPHAO', 'Binh khí cối, pháo mặt đất, PPK', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_KHITAIQUANGHOC', 'Khí tài quang học quân sự', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_NHANBIETPHANLO', 'Nhận biết & Phân loại các loại đạn', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_BAOQUANXEPDOVA', 'Bảo quản, xếp dỡ, vận chuyển, niêm cất tại kho', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_KIEMTRAPHANCAP', 'Kiểm tra, phân cấp, bảo dưỡng VKKT', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_THUCTAPCHUYENM', 'Thực tập chuyên môn kho tàng', 4, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQD_GIOITHIEUBINHK', 'Giới thiệu binh khí súng BB & Binh chủng', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQD_QUYTACANTOANKH', 'Quy tắc an toàn kho đạn dược', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQD_HIEUBIETCHUNGV', 'Hiểu biết chung về đạn dược', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQD_CONGTACBAOQUAN', 'Công tác bảo quản, bảo dưỡng, phân cấp, niêm cất đạn', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_KYTHUATCHUYENN', 'Kỹ thuật chuyên ngành Báo vụ', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_THUBAOEMUC1', 'Thu báo Đề mục 1', 2, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_PHATBAOEMUC1', 'Phát báo Đề mục 1', 2, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_THUBAOEMUC2', 'Thu báo Đề mục 2', 2, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_PHATBAOEMUC2', 'Phát báo Đề mục 2', 2, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_THUBAOEMUC3', 'Thu báo Đề mục 3', 2, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_PHATBAOEMUC3', 'Phát báo Đề mục 3', 2, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_THUBAOEMUC4', 'Thu báo Đề mục 4', 2, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_PHATBAOEMUC4', 'Phát báo Đề mục 4', 2, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_VUOTVATCANTRON', 'Vượt vật cản trong HL thể lực + Bơi', 3, 7) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_LIENLACBAOVUCU', 'Liên lạc báo vụ cự ly gần', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_PHATBAOEMUC5', 'Phát báo Đề mục 5', 2, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_THUBAOEMUC5', 'Thu báo Đề mục 5', 2, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_THONGBAOGIANGU', 'Thông báo Giảng đường', 2, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_LIENLACBAOVUCU_2', 'Liên lạc báo vụ cự ly xa', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('COI_BINHKHI', 'Binh khí', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('COI_THAOTACCHIENAU', 'Thao tác chiến đấu', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('COI_BANPHAOBAI1MUC', 'Bắn pháo Bài 1: Mục tiêu cố định ban ngày', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('COI_THINOIDUNGBANP', 'Thi nội dung bắn pháo', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_KIENTHUCCOSOPH', 'Kiến thức cơ sở Pháo binh', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_HIEUBIETCHUNGI', 'Hiểu biết chung & Địa hình quân sự', 3, 7) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_OACCHUYENNGANH', 'Đo đạc chuyên ngành Pháo binh', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_KIEMTRABANTHUS', 'Kiểm tra bắn thử, sửa bắn pháo', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_CHUANBIPHANTUB', 'Chuẩn bị phần tử bắn pháo', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_THIKETTHUCMONC', 'Thi kết thúc môn chuyên ngành', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_CHIENTHUATCHUY', 'Chiến thuật chuyên ngành Tiểu đội', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_CHIENTHUATCHUY_2', 'Chiến thuật chuyên ngành Trung đội', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_KYTHUATPHAORAN', 'Kỹ thuật pháo rãnh xoắn', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_ANPHAO', 'Đạn pháo', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_CONGTACCHUANBI', 'Công tác chuẩn bị pháo hành quân, chiến đấu', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_THIKYTHUATCHUY', 'Thi Kỹ thuật chuyên ngành', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_THAOTACONGTACP', 'Thao tác động tác pháo thủ', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_THAOTACLUONGSU', 'Thao tác lượng sửa riêng Khẩu đội', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_THAOTACNGAMBAN', 'Thao tác ngắm bắn trận địa che khuất', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_THAOTACBANNGAM', 'Thao tác bắn, ngắm bắn trực tiếp mục tiêu', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_CHIENTHUATCHUY', 'Chiến thuật chuyên ngành Khẩu đội', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PK37_XAKICHPHONGKHO', 'Xạ kích Phòng không', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PK37_THAOTACCHIENAU', 'Thao tác chiến đấu Phòng không', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PK127_CONGTACCHIENAU', 'Công tác chiến đấu SMPK 12,7mm', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PK127_LYLUANXAKICHSM', 'Lý luận Xạ kích SMPK 12,7mm', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PK127_BANBAI3ASMPK12', 'Bắn Bài 3a SMPK 12,7mm', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PK127_THAOTACBANBAI3', 'Thao tác bắn Bài 3a SMPK 12,7mm', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('CB_KYTHUATPHANO', 'Kỹ thuật Phá nổ', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('CB_XEMAYCONGTRINH', 'Xe máy công trình', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('CB_KYTHUATVATCANC', 'Kỹ thuật vật cản Công binh', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('CB_CAUQUANSU', 'Cầu quân sự', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('CB_KYTHUATCONGSU', 'Kỹ thuật Công sự', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('CB_UONGQUANSU', 'Đường quân sự', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('CB_NGUYTRANGCUNGC', 'Ngụy trang & Cung cấp nước', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('SPG9_BANPHAOANTHAT', 'Bắn pháo (Đạn thật)', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TSBB_IAHINHAPSABANT', 'Địa hình đắp sa bàn Trinh sát', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TSBB_CHIENTHUATTOTR', 'Chiến thuật tổ Trinh sát', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TSBB_KYTHUATANHBATI', 'Kỹ thuật đánh bắt địch (Võ chiến đấu)', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TSBB_KYTHUATKHACPHU', 'Kỹ thuật khắc phục vật cản Trinh sát', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TSBB_KYTHUATTRINHSA', 'Kỹ thuật trinh sát bí mật vận động', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TSBB_BANAK2BANNGAYT', 'Bắn AK-2 ban ngày (Trinh sát)', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TSBB_BANAK3BANEMTRI', 'Bắn AK-3 ban đêm (Trinh sát)', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('AGS17_THIKYTHUATBANS', 'Thi Kỹ thuật bắn Súng phóng lựu', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('AGS17_KIEMTRACHIENTH', 'Kiểm tra Chiến thuật tiến công', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('AGS17_THICHIENTHUATC', 'Thi Chiến thuật chuyên ngành AGS-17', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_KIONTHCCSE', 'KiÕn thøc c¬ së', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_VETCNHLTLBI', 'VËt c¶n HLTL + B¬i', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_BINHKHY', 'Binh khÝ', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_THAOTC', 'Thao t¸c', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_THINDB34NPHO', 'Thi ND b¾n ph¸o', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_KIOMTRAKHXHNVP', 'KiÓm tra KHXHNV phÇn 1', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_CHIONTHUETCN', 'ChiÕn thuËt CN', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_KIOMTRAKHXHNVP_2', 'KiÓm tra KHXHNV phÇn 2', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_TRUNGBNHCENG', 'Trung b×nh céng', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_NOIDUNGCOBANVE', 'Nội dung cơ bản về công tác Hậu cần', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_BEPHOANGCAM', 'Bếp Hoàng Cầm', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_LUONGTHUCTHUCP', 'Lương thực thực phẩm & Sinh lý dinh dưỡng', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_NGHIEPVUQUANNH', 'Nghiệp vụ quân nhu 1', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_NGHIEPVUQUANNH_2', 'Nghiệp vụ quân nhu 2 (Sổ sách)', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_TRANGBINHAANNH', 'Trang bị nhà ăn, nhà bếp', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_B34NAK2BANNGY', 'B¾n AK-2 ban ngµy', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_KUTHUETNEUNLYT', 'Kü thuËt  nÊu ¨n (lý thuyÕt)', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_THUCHNHCHOBION', 'Thùc hµnh chÕ biÕn giÕt mæ(lý thuyÕt)', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_THUCTEPCCBOP', 'Thùc tËp c¸c bÕp', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_THUCHNHCHOBION_2', 'Thùc hµnh chÕ biÕn giÕt mæ', 3, 6) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, department_id = EXCLUDED.department_id;

-- 4. Tạo các Lộ trình đào tạo chuẩn theo Đối tượng & Chuyên ngành

DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'VTD';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Vô tuyến điện', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở Thông tin VTĐ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi Điện đài VTĐ sóng cực ngắn' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điện đài VTĐ SCN VRU-812; 812/S' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Máy thu phát đa băng tần VRP-712/S' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Máy thu phát VRH-811/A; 811/S, 911' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức những vấn đề chung TT VTĐ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Nghiệp vụ thông tin VTĐ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật chuyên ngành' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'HTD';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Hữu tuyến điện', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở Thông tin HTĐ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức chuyên ngành thiết bị TT HTĐ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Nghiệp vụ Thông tin HTĐ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật chuyên ngành TT HTĐ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'NVQY';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Nhân viên Kỹ thuật (NVKT) - Nhân viên Quân y Đại đội', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giải phẫu sinh lý' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Dược lý & Thuốc thường dùng' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều dưỡng cơ bản' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bệnh nội khoa' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = '5 kỹ thuật cấp cứu chiến thương' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vệ sinh phòng dịch' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bệnh ngoại khoa' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Tổ chức chiến thuật quân y' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Hậu cần & Kỹ thuật' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Y học cổ truyền' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thực tập bệnh viện' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'DL';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng Đại liên', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở Súng Đại liên' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn Đại liên Bài 3 ban đêm' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn Đại liên Bài 1 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn Đại liên Bài 3 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn mục tiêu treo tại chỗ Bài 1 KĐ Đại liên' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật aĐL chi viện bBB tiến công, phòng ngự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật aĐL chi viện cBB tiến công, phòng ngự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Phương pháp duy trì luyện tập bắn Đại liên' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'C60';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Súng Cối 60mm', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở Súng Cối 60mm' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn Cối 60mm Bài 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bài 2: Bắn cối chuẩn bị gấp ban đêm' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bài 3: Bắn gián tiếp ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Phương pháp duy trì luyện tập bắn Cối 60mm' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bài bắn ứng dụng đạn huấn luyện' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật Cối 60 chi viện bBB tiến công, phòng ngự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật Cối 60 chi viện cBB tiến công, phòng ngự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'NVBQVK';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Nhân viên Kỹ thuật (NVKT) - Nhân viên Bảo quản Vũ khí', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Địa hình Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Hậu cần & Kỹ thuật' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khí súng Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khí cối, pháo mặt đất, PPK' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Khí tài quang học quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Nhận biết & Phân loại các loại đạn' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bảo quản, xếp dỡ, vận chuyển, niêm cất tại kho' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra, phân cấp, bảo dưỡng VKKT' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thực tập chuyên môn kho tàng' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'NVBQD';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Nhân viên Kỹ thuật (NVKT) - Nhân viên Bảo quản Đạn', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Địa hình Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Hậu cần & Kỹ thuật' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giới thiệu binh khí súng BB & Binh chủng' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Quy tắc an toàn kho đạn dược' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Hiểu biết chung về đạn dược' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Công tác bảo quản, bảo dưỡng, phân cấp, niêm cất đạn' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thực tập chuyên môn kho tàng' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'BVU';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Nhân viên Kỹ thuật (NVKT) - Nhân viên Báo vụ', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ thuật chuyên ngành Báo vụ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thu báo Đề mục 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Phát báo Đề mục 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thu báo Đề mục 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Phát báo Đề mục 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thu báo Đề mục 3' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Phát báo Đề mục 3' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thu báo Đề mục 4' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Phát báo Đề mục 4' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vượt vật cản trong HL thể lực + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Liên lạc báo vụ cự ly gần' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Phát báo Đề mục 5' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thu báo Đề mục 5' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thông báo Giảng đường' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Liên lạc báo vụ cự ly xa' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'COI';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội súng Cối 82mm', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khí' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tác chiến đấu' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn pháo Bài 1: Mục tiêu cố định ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi nội dung bắn pháo' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật chuyên ngành' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'C100';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng Cối 100mm', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khí' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tác chiến đấu' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn pháo Bài 1: Mục tiêu cố định ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi nội dung bắn pháo' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật chuyên ngành' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'KTPB';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Kế toán Pháo binh', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở Pháo binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Hiểu biết chung & Địa hình quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Đo đạc chuyên ngành Pháo binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra bắn thử, sửa bắn pháo' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chuẩn bị phần tử bắn pháo' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi kết thúc môn chuyên ngành' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật chuyên ngành Tiểu đội' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật chuyên ngành Trung đội' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'PXK';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng Pháo xe kéo', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ thuật pháo rãnh xoắn' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Đạn pháo' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Công tác chuẩn bị pháo hành quân, chiến đấu' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi Kỹ thuật chuyên ngành' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tác động tác pháo thủ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tác lượng sửa riêng Khẩu đội' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tác ngắm bắn trận địa che khuất' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tác bắn, ngắm bắn trực tiếp mục tiêu' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật chuyên ngành Khẩu đội' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật chuyên ngành Trung đội' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'PK37';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng PPK 37mm', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khí' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Xạ kích Phòng không' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tác chiến đấu Phòng không' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật chuyên ngành' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'PK57';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng PPK 57mm', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khí' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Xạ kích Phòng không' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tác chiến đấu Phòng không' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật chuyên ngành' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'PK127';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng SMPK 12,7mm', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khí' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Công tác chiến đấu SMPK 12,7mm' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Lý luận Xạ kích SMPK 12,7mm' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn Bài 3a SMPK 12,7mm' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tác bắn Bài 3a SMPK 12,7mm' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật chuyên ngành' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'CB';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Công binh, Công trình', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ thuật Phá nổ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Xe máy công trình' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ thuật vật cản Công binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Cầu quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ thuật Công sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Đường quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Ngụy trang & Cung cấp nước' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'SPG9';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng ĐKZ SPG-9', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khí' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tác chiến đấu' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn pháo (Đạn thật)' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi nội dung bắn pháo' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật chuyên ngành' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'TSBB';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Trinh sát Bộ binh', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Địa hình đắp sa bàn Trinh sát' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật tổ Trinh sát' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ thuật đánh bắt địch (Võ chiến đấu)' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ thuật khắc phục vật cản Trinh sát' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ thuật trinh sát bí mật vận động' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày (Trinh sát)' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-3 ban đêm (Trinh sát)' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'AGS17';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng súng PL AGS-17', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi Kỹ thuật bắn Súng phóng lựu' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra Chiến thuật tiến công' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi Chiến thuật chuyên ngành AGS-17' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'DKZ';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Súng ĐKZ (82-K65)', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'KiÕn thøc c¬ së' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'VËt c¶n HLTL + B¬i' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khÝ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2 ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao t¸c' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn pháo Bài 1: Mục tiêu cố định ban ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi ND b¾n ph¸o' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'KiÓm tra KHXHNV phÇn 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'ChiÕn thuËt CN' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'KiÓm tra KHXHNV phÇn 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung b×nh céng' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'NA';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO curriculums (major_id, course_id, name, total_credits)
        VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Nấu ăn', 45)
        RETURNING id INTO v_curr_id;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Nội dung cơ bản về công tác Hậu cần' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bếp Hoàng Cầm' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Lương thực thực phẩm & Sinh lý dinh dưỡng' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Nghiệp vụ quân nhu 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Nghiệp vụ quân nhu 2 (Sổ sách)' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trang bị nhà ăn, nhà bếp' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'KiÓm tra KHXHNV phÇn 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'VËt c¶n HLTL + B¬i' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'B¾n AK-2 ban ngµy' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kü thuËt  nÊu ¨n (lý thuyÕt)' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thùc hµnh chÕ biÕn giÕt mæ(lý thuyÕt)' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thùc tËp c¸c bÕp' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thùc hµnh chÕ biÕn giÕt mæ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'KiÓm tra KHXHNV phÇn 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung b×nh céng' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giáo dục Chính trị' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ - Chiến thuật Bộ binh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'BB';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        -- Kiểm tra xem đã có curriculum chưa
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Sĩ quan Dự bị (SQDB) - Sĩ quan Dự bị Binh chủng Hợp thành (Bộ binh)', 45)
            RETURNING id INTO v_curr_id;
            
            -- Gán các môn quân sự chung & chính trị
            FOR v_sub_id IN SELECT id FROM subjects WHERE code IN ('QS101', 'QS102', 'QS103', 'QS104', 'QS105', 'QS106') LOOP
                INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
                VALUES (v_curr_id, v_sub_id, 1, true)
                ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
            END LOOP;
        END IF;
    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'TSBB';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        -- Kiểm tra xem đã có curriculum chưa
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Sĩ quan Dự bị (SQDB) - Sĩ quan Dự bị Trinh sát Bộ binh', 45)
            RETURNING id INTO v_curr_id;
            
            -- Gán các môn quân sự chung & chính trị
            FOR v_sub_id IN SELECT id FROM subjects WHERE code IN ('QS101', 'QS102', 'QS103', 'QS104', 'QS105', 'QS106') LOOP
                INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
                VALUES (v_curr_id, v_sub_id, 1, true)
                ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
            END LOOP;
        END IF;
    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'COI';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        -- Kiểm tra xem đã có curriculum chưa
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Sĩ quan Dự bị (SQDB) - Sĩ quan Dự bị Súng Cối 82mm', 45)
            RETURNING id INTO v_curr_id;
            
            -- Gán các môn quân sự chung & chính trị
            FOR v_sub_id IN SELECT id FROM subjects WHERE code IN ('QS101', 'QS102', 'QS103', 'QS104', 'QS105', 'QS106') LOOP
                INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
                VALUES (v_curr_id, v_sub_id, 1, true)
                ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
            END LOOP;
        END IF;
    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'DKZ';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        -- Kiểm tra xem đã có curriculum chưa
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Sĩ quan Dự bị (SQDB) - Sĩ quan Dự bị Súng ĐKZ (82-K65, SPG-9)', 45)
            RETURNING id INTO v_curr_id;
            
            -- Gán các môn quân sự chung & chính trị
            FOR v_sub_id IN SELECT id FROM subjects WHERE code IN ('QS101', 'QS102', 'QS103', 'QS104', 'QS105', 'QS106') LOOP
                INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
                VALUES (v_curr_id, v_sub_id, 1, true)
                ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
            END LOOP;
        END IF;
    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'PK127';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        -- Kiểm tra xem đã có curriculum chưa
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Sĩ quan Dự bị (SQDB) - Sĩ quan Dự bị Súng máy Phòng không 12,7mm', 45)
            RETURNING id INTO v_curr_id;
            
            -- Gán các môn quân sự chung & chính trị
            FOR v_sub_id IN SELECT id FROM subjects WHERE code IN ('QS101', 'QS102', 'QS103', 'QS104', 'QS105', 'QS106') LOOP
                INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
                VALUES (v_curr_id, v_sub_id, 1, true)
                ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
            END LOOP;
        END IF;
    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'PB';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        -- Kiểm tra xem đã có curriculum chưa
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Sĩ quan Dự bị (SQDB) - Sĩ quan Dự bị Pháo binh', 45)
            RETURNING id INTO v_curr_id;
            
            -- Gán các môn quân sự chung & chính trị
            FOR v_sub_id IN SELECT id FROM subjects WHERE code IN ('QS101', 'QS102', 'QS103', 'QS104', 'QS105', 'QS106') LOOP
                INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
                VALUES (v_curr_id, v_sub_id, 1, true)
                ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
            END LOOP;
        END IF;
    END IF;
END $$;


DO $$
DECLARE
    v_major_id INT;
    v_course_id INT;
    v_curr_id INT;
    v_sub_id INT;
BEGIN
    SELECT id INTO v_major_id FROM majors WHERE code = 'TT';
    SELECT id INTO v_course_id FROM courses WHERE code = 'SQDB2026';
    
    IF v_major_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        -- Kiểm tra xem đã có curriculum chưa
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Sĩ quan Dự bị (SQDB) - Sĩ quan Dự bị Thông tin Kỹ thuật', 45)
            RETURNING id INTO v_curr_id;
            
            -- Gán các môn quân sự chung & chính trị
            FOR v_sub_id IN SELECT id FROM subjects WHERE code IN ('QS101', 'QS102', 'QS103', 'QS104', 'QS105', 'QS106') LOOP
                INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
                VALUES (v_curr_id, v_sub_id, 1, true)
                ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
            END LOOP;
        END IF;
    END IF;
END $$;

COMMIT;
