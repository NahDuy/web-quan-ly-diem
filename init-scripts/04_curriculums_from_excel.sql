-- Script tự động nạp danh mục môn học và lộ trình đào tạo từ KetQuaHocPhan.xlsx
BEGIN;

-- 1. Bổ sung các môn học vào bảng subjects
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_VATCANHLTLBOI', 'Vật cản HLTL + Bơi', 3, 7) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_THIIENAIVTSCN', 'Thi Điện đài VTĐ Scn', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_IENAIVTSCNVRU81', 'Điện đài VTĐ ScnVRU 812; 812/S', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_MOYTHUPHOTABANG', 'Mỏy thu phỏt đa băng tần VRP-712/S', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_MTHUPHOTVRH811A', 'M. thu, phỏt VRH- 811/A; 811/S, 911...', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_BANAK2BANNGAY', 'Bắn AK-2 ban ngày', 3, 7) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_IEULENHQUANSU', 'Điều lệnh Quân sự', 3, 7) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_NGIEPVUTHUNGTIN', 'Ngiệp vụ thụng tin VTĐ', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_KIEMTRAKHXHNVPH', 'Kiểm tra KHXH&NV Phần 1', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_CHIENTHUATCN', 'Chiến thuật CN', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_KIEMTRAKHXHNVPH_2', 'Kiểm tra KHXH&NV Phần 2', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('VTD_TRUNGBONHCONG', 'Trung bỡnh cộng', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TN_GIAODUCCHINHTRI', 'Giáo dục Chính trị', 2, 8) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TN_KYCHIENTHUATBOB', 'Kỹ - Chiến thuật Bộ binh', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('HTD_KYCHIENTHUATBB', 'Kỹ-chiện thuật BB', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('HTD_IEULINH', 'điểu lình', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('HTD_TBTHI', 'TB thi', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_GIAIPHAUSINHLY', 'Giải phẫu sinh lý', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_THUOCTHUONGDUNG', 'Thuốc thường dựng', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_IEUDUONGCOBAN', 'Điều dưỡng cơ bản', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_BENHNOIKHOA', 'Bệnh nội khoa', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_5KYTHUATCAPCUU', '5 kỹ thuật cấp cứu', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_VESINHPHUNGDICH', 'Vệ sinh phũng dịch', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_BENHNGOAIKHOA', 'Bệnh ngoại khoa', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_TOCHUCCHIENTHUA', 'Tổ chức chiến thuật quõn y', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_KHXHNVPHAN1', 'KHXH&NV phần 1', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_KHXHNVPHAN2', 'KHXH&NV phần 2', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVQY_HAUCANKYTHUAT', 'Hậu cần & Kỹ thuật', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_KIENTHUCCOSOAIL', 'Kiến thức cơ sở Đại liờn', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_BANAILION3OM', 'Bắn Đại liờn-3 đờm', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_BANAILION1NGAY', 'Bắn Đại liờn-1 ngày', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_BANAILION3NGAY', 'Bắn Đại liờn-3 ngày', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_BANMTREOTAICHOB', 'Bắn M treo tại chỗ B1 KĐ Đại liờn', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_CTHUATALCHIVIEN', 'C. thuật aĐL chi viện bBBTC, PN', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_CTHUATALCHIVIEN_2', 'C. thuật aĐL chi viện cBBTC, PN', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DL_PPDUYTROLUYENTA', 'PP duy trỡ luyện tập bắn ĐL', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_KIENTHUCCOSOCNC', 'Kiến thức cơ sở CN cO 60 mm', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_BANCO601', 'Bắn co 60-1', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_B2BANTOOCHUANBI', 'B2: Bắn Too chuẩn bị gấp b. đờm', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_B3BANGIONTIEPBN', 'B3: Bắn giỏn tiếp b. ngày', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_PPDUYTROLUYENTA', 'PP duy trỡ luyện tập bắn cO60', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_BAIBANUNGDUNGAN', 'Bài: Bắn ứng dụng đạn h. luyện', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_CTHUATCO60CHIVI', 'C. thuật co60 chi viện bBB TC, PN', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C60_CTHUATCO60CHIVI_2', 'C. thuật co60 chi viện cBB TC, PN', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_KIENTHUCCOSO', 'Kiến thức cơ sở', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_IAHONHQUONSU', 'Địa hỡnh quõn sự', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_BINHKHOSYNGBB', 'Binh khớ sỳng BB', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_BINHKHOCOIPHOOM', 'Binh khớ cối, phỏo mặt đất, PPK', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_KHOTAIQUANGHOC', 'Khớ tài quang học', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_COCHNHANBIETMOT', 'Cỏch nhận biết một số loại đạn', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_BQUANXDOVCHUYEN', 'B. quản, x. dỡ,v. chuyển, niờm cất tại kho', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_KIEMTRAPHONCAPB', 'Kiểm tra, phõn cấp, bảo dưỡng VKKT', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQVK_THUCTAP', 'Thực tập', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQD_GIOITHIEUBINHKH', 'Giới thiệu binh khớ sỳng BB, BC', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQD_QUYINHQUYTACANT', 'Quy định, quy tắc an toàn kho đạn dược', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQD_HIEUBIETCHUNGVE', 'Hiểu biết chung về đạn dược', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NVBQD_CTOCBQUANBDUONG', 'C. tỏc b. quản,.b. dưỡng p. cấp,niờm cất đạn', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_KYTHUATCHUYONNG', 'Kỹ thuật chuyờn nghành', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_THUBOOEMUC1', 'Thu bỏo đề mục 1', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_PHOTBOOEMUC1', 'Phỏt bỏo đề mục 1', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_THUBOOEMUC2', 'Thu bỏo đề mục 2', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_PHOTBOOEMUC2', 'Phỏt bỏo đề mục 2', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_THUBOOEMUC3', 'Thu bỏo Đề mục 3', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_PHOTBOOEMUC3', 'Phỏt bỏo Đề mục 3', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_THUBOOEMUC4', 'Thu bỏo Đề mục 4', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_PHOTBOOEMUC4', 'Phỏt bỏo Đề mục 4', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_VUOTVATCANTRONG', 'Vượt vật cản trong HL thể lực + Bơi', 3, 7) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_LIONLACCULYGAN', 'Liờn lạc cự ly gần', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('BVU_PHOTBOOEMUC5', 'Phỏt bỏo đề mục 5', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('COI_BINHKHO', 'Binh khớ', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('COI_THAOTOC', 'Thao tỏc', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('COI_BANPHOOB1MCOINH', 'Bắn phỏo B 1: M cố đinh b. ngày', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('COI_THINDBANPHOO', 'Thi ND bắn phỏo', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('C100_BANPHOOB1MCOINH', 'Bắn phỏo b 1: M cố đinh b. ngày', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_KIENTHUCCOSOTHI', 'Kiến thức cơ sở thi', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_HIEUBIETCHUNGIA', 'Hiểu biết chung, Địa hỡnh', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_OACCHUYONNGANH', 'Đo đạc chuyờn ngành', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_KIEMTRABANTHUSU', 'Kiểm tra bắn thử, sửa bắn phỏo', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_CHUANBIPHANTUBA', 'Chuẩn bị phần tử Bắn', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_THIHETMUNCHUYON', 'Thi hết mụn chuyờn ngành', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_CHIENTHUATCNTIE', 'Chiến thuật CN Tiểu đội', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('KTPB_CHIENTHUATCNTRU', 'Chiến thuật CN Trung đội', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_KYTHUATPHOORONH', 'Kỹ thuật phỏo rónh xoắn', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_ANPHOO', 'Đạn phỏo', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_CTCBIPHOOHANHQU', 'CT C. bị phỏo hành quõn, CĐ', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_THIKYTHUATCN', 'Thi kỹ thuật CN', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_THAOTOCONGTOCPH', 'Thao tỏc Động tỏc phỏo thủ', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_THAOTOCLUONGSUA', 'Thao tỏc Lượng sửa riờng KĐ', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_THAOTOCNBANTRAN', 'Thao tỏc,N bắn trận địa che khuất', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_THAOTOCBANNBANT', 'Thao tỏc bắn,N bắn trực tiếp M', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PXK_CHIENTHUATCNKHA', 'Chiến thuật CN khẩu đội', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PK37_XAKOCH', 'Xạ kớch', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PK37_THAOTOCCHIENAU', 'Thao tỏc chiến đấu', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PK127_CUNGTOCCHIENAU', 'Cụng tỏc chiến đấu', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PK127_LYLUANXAKOCH', 'Lý luận Xạ kớch', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PK127_BANBAI3ASMPK127', 'Bắn bài 3a SMPK 12,7', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('PK127_THAOTOCBANBAI3A', 'Thao tỏc bắn bài 3a', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('CB_PHONO', 'Phỏ nổ', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('CB_XEMOYCUNGTRONH', 'Xe mỏy cụng trỡnh', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('CB_KYTHUATVATCAN', 'Kỹ thuật vật cản', 3, 7) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('CB_CAUQUONSU', 'Cầu quõn sự', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('CB_KTCUNGSU', 'KT Cụng sự', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('CB_UONGQUONSU', 'Đường quõn sự', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('CB_NGUYTRANGCUNGCA', 'Nguỵ trang, cung cấp nước', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('SPG9_BANPHOOANTHAT', 'Bắn phỏo (đạn thật)', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TSBB_IAHONHAPSABANTR', 'Địa hỡnh đắp sa bàn Trinh sỏt', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TSBB_CHIENTHUATTOTRI', 'Chiến thuật tổ Trinh sỏt', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TSBB_KYTHUATONHBATIC', 'Kỹ thuật đỏnh bắt địch (vừ)', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TSBB_KYTHUATKHACPHUC', 'Kỹ thuật khắc phục vật cản', 3, 7) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TSBB_KYTHUATTSOTBOMA', 'Kỹ thuật T. sỏt bớ mật v. động', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TSBB_BANAK2DNGAYTSOT', 'Bắn AK-2d ngày ,TSỏt', 3, 7) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('TSBB_BANAK3DOMTSOT', 'Bắn AK-3d đờm,TSỏt', 3, 7) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('AGS17_THIKYTHUATBAN', 'Thi kỹ thuật bắn', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('AGS17_KIEMTRACHIENTHU', 'Kiểm tra Chiến thuật T. cụng', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('AGS17_THICHIENTHUAT', 'Thi Chiến thuật', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_KIENTHUCCOSO', 'Kiện thức cơ sở', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_BINHKHI', 'Binh khị', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_THAOTAC', 'Thao tác', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_BANPHAOB1MCOINH', 'Bắn pháo b 1: M cố ®inh b. ngày', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_THINDBANPHAO', 'Thi ND bắn pháo', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_KIEMTRAKHXHNVPH', 'Kiễm tra KHXHNV phần 1', 3, 8) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_CHIENTHUATCN', 'Chiện thuật CN', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_KIEMTRAKHXHNVPH_2', 'Kiễm tra KHXHNV phần 2', 3, 8) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('DKZ_TRUNGBINHCONG', 'Trung bỉnh cộng', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_NDCOBANVECTHAUC', 'ND cơ bản vể CT hậu cần', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_BEPHOANGCAM', 'Bệp Hoàng cầm', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_NGHIIPVUQUANNHU', 'Nghiìp vụ quân nhu 1', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_NGHIIPVUQUANNHU_2', 'Nghiìp vụ quân nhu 2 (sổ sách)', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_TRANGBNHAANNHAB', 'Trang bÞ nhà ăn, nhà bệp', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_KYTHUATNAUANLYT', 'Kỹ thuật nấu ăn (lý thuyệt)', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_THUCHANHCHEBIEN', 'Thực hành chệ biện giệt mổ(lý thuyệt)', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_THUCTAPCACBEP', 'Thực tập các bệp', 3, 6) ON CONFLICT (code) DO NOTHING;
INSERT INTO subjects (code, name, credits, department_id) VALUES ('NA_THUCHANHCHEBIEN_2', 'Thực hành chệ biện giệt mổ', 3, 6) ON CONFLICT (code) DO NOTHING;

-- 2. Đảm bảo khóa đào tạo mặc định
INSERT INTO courses (code, name, start_year, end_year) VALUES ('SQDB2026', 'Khóa Đào tạo Năm 2026', 2026, 2026) ON CONFLICT (code) DO NOTHING;

-- 3. Tạo lộ trình đào tạo theo từng Đối tượng & Chuyên ngành

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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Vô tuyến điện', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Vô tuyến điện' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vật cản HLTL + Bơi' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi Điện đài VTĐ Scn' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điện đài VTĐ ScnVRU 812; 812/S' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Mỏy thu phỏt đa băng tần VRP-712/S' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'M. thu, phỏt VRH- 811/A; 811/S, 911...' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Ngiệp vụ thụng tin VTĐ' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật CN' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung bỡnh cộng' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Hữu tuyến điện', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Hữu tuyến điện' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra KHXH&NV Phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung bỡnh cộng' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ-chiện thuật BB' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'điểu lình' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'TB thi' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Nhân viên Kỹ thuật (NVKT) - Nhân viên Quân y Đại đội', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Nhân viên Kỹ thuật (NVKT) - Nhân viên Quân y Đại đội' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thuốc thường dựng' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = '5 kỹ thuật cấp cứu' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Vệ sinh phũng dịch' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Tổ chức chiến thuật quõn y' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'KHXH&NV phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'KHXH&NV phần 2' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng Đại liên', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng Đại liên' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở Đại liờn' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn Đại liờn-3 đờm' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn Đại liờn-1 ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn Đại liờn-3 ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn M treo tại chỗ B1 KĐ Đại liờn' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'C. thuật aĐL chi viện bBBTC, PN' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'C. thuật aĐL chi viện cBBTC, PN' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'PP duy trỡ luyện tập bắn ĐL' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung bỡnh cộng' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Súng Cối 60mm', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Súng Cối 60mm' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở CN cO 60 mm' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn co 60-1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'B2: Bắn Too chuẩn bị gấp b. đờm' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'B3: Bắn giỏn tiếp b. ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'PP duy trỡ luyện tập bắn cO60' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bài: Bắn ứng dụng đạn h. luyện' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'C. thuật co60 chi viện bBB TC, PN' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'C. thuật co60 chi viện cBB TC, PN' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung bỡnh cộng' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Nhân viên Kỹ thuật (NVKT) - Nhân viên Bảo quản Vũ khí', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Nhân viên Kỹ thuật (NVKT) - Nhân viên Bảo quản Vũ khí' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Địa hỡnh quõn sự' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khớ sỳng BB' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khớ cối, phỏo mặt đất, PPK' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Khớ tài quang học' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Cỏch nhận biết một số loại đạn' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'B. quản, x. dỡ,v. chuyển, niờm cất tại kho' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra, phõn cấp, bảo dưỡng VKKT' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thực tập' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Nhân viên Kỹ thuật (NVKT) - Nhân viên Bảo quản Đạn', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Nhân viên Kỹ thuật (NVKT) - Nhân viên Bảo quản Đạn' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Địa hỡnh quõn sự' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Giới thiệu binh khớ sỳng BB, BC' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Quy định, quy tắc an toàn kho đạn dược' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'C. tỏc b. quản,.b. dưỡng p. cấp,niờm cất đạn' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thực tập' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung bỡnh cộng' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Nhân viên Kỹ thuật (NVKT) - Nhân viên Báo vụ', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Nhân viên Kỹ thuật (NVKT) - Nhân viên Báo vụ' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ thuật chuyờn nghành' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thu bỏo đề mục 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Phỏt bỏo đề mục 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thu bỏo đề mục 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Phỏt bỏo đề mục 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thu bỏo Đề mục 3' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Phỏt bỏo Đề mục 3' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thu bỏo Đề mục 4' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Phỏt bỏo Đề mục 4' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Liờn lạc cự ly gần' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Phỏt bỏo đề mục 5' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội súng Cối 82mm', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội súng Cối 82mm' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khớ' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tỏc' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn phỏo B 1: M cố đinh b. ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi ND bắn phỏo' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật CN' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung bỡnh cộng' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ-chiện thuật BB' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng Cối 100mm', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng Cối 100mm' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khớ' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tỏc' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn phỏo b 1: M cố đinh b. ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi ND bắn phỏo' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật CN' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung bỡnh cộng' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ-chiện thuật BB' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Kế toán Pháo binh', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Kế toán Pháo binh' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiến thức cơ sở thi' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Hiểu biết chung, Địa hỡnh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Đo đạc chuyờn ngành' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra bắn thử, sửa bắn phỏo' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chuẩn bị phần tử Bắn' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi hết mụn chuyờn ngành' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật CN Tiểu đội' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật CN Trung đội' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng Pháo xe kéo', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng Pháo xe kéo' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ thuật phỏo rónh xoắn' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Đạn phỏo' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'CT C. bị phỏo hành quõn, CĐ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi kỹ thuật CN' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tỏc Động tỏc phỏo thủ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tỏc Lượng sửa riờng KĐ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tỏc,N bắn trận địa che khuất' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tỏc bắn,N bắn trực tiếp M' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật CN khẩu đội' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng PPK 37mm', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng PPK 37mm' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khớ' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Xạ kớch' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tỏc chiến đấu' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật CN' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung bỡnh cộng' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ-chiện thuật BB' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'điểu lình' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'TB thi' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng PPK 57mm', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng PPK 57mm' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khớ' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Xạ kớch' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tỏc chiến đấu' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật CN' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung bỡnh cộng' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ-chiện thuật BB' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'điểu lình' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'TB thi' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng SMPK 12,7mm', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng SMPK 12,7mm' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khớ' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Cụng tỏc chiến đấu' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Lý luận Xạ kớch' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn bài 3a SMPK 12,7' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tỏc bắn bài 3a' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật CN' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung bỡnh cộng' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ-chiện thuật BB' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Công binh, Công trình', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Công binh, Công trình' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Phỏ nổ' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Xe mỏy cụng trỡnh' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ thuật vật cản' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Cầu quõn sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'KT Cụng sự' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Đường quõn sự' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Nguỵ trang, cung cấp nước' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung bỡnh cộng' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng ĐKZ SPG-9', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng ĐKZ SPG-9' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khớ' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tỏc' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn phỏo (đạn thật)' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi ND bắn phỏo' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật CN' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung bỡnh cộng' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ-chiện thuật BB' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Trinh sát Bộ binh', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Trinh sát Bộ binh' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Điều lệnh Quân sự' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Địa hỡnh đắp sa bàn Trinh sỏt' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiến thuật tổ Trinh sỏt' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ thuật đỏnh bắt địch (vừ)' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ thuật khắc phục vật cản' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ thuật T. sỏt bớ mật v. động' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-2d ngày ,TSỏt' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn AK-3d đờm,TSỏt' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung bỡnh cộng' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng súng PL AGS-17', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Khẩu đội trưởng súng PL AGS-17' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi kỹ thuật bắn' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiểm tra Chiến thuật T. cụng' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi Chiến thuật' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung bỡnh cộng' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ-chiện thuật BB' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'điểu lình' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'TB thi' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Súng ĐKZ (82-K65)', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Khẩu đội trưởng (KĐT) - Súng ĐKZ (82-K65)' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiện thức cơ sở' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Binh khị' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thao tác' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bắn pháo b 1: M cố ®inh b. ngày' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thi ND bắn pháo' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'điểu lình' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiễm tra KHXHNV phần 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Chiện thuật CN' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiễm tra KHXHNV phần 2' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trung bỉnh cộng' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ-chiện thuật BB' LIMIT 1;
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
        -- Tìm hoặc tạo curriculum
        SELECT id INTO v_curr_id FROM curriculums WHERE major_id = v_major_id AND course_id = v_course_id;
        IF v_curr_id IS NULL THEN
            INSERT INTO curriculums (major_id, course_id, name, total_credits)
            VALUES (v_major_id, v_course_id, 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Nấu ăn', 45)
            RETURNING id INTO v_curr_id;
        ELSE
            UPDATE curriculums SET name = 'Lộ trình Đào tạo Tiểu đội trưởng (TĐT) - Tiểu đội trưởng Nấu ăn' WHERE id = v_curr_id;
        END IF;

        -- Thêm các môn học phần


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'ND cơ bản vể CT hậu cần' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Bệp Hoàng cầm' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Nghiìp vụ quân nhu 1' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Nghiìp vụ quân nhu 2 (sổ sách)' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Trang bÞ nhà ăn, nhà bệp' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kiễm tra KHXHNV phần 1' LIMIT 1;
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


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Kỹ thuật nấu ăn (lý thuyệt)' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'điểu lình' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thực hành chệ biện giệt mổ(lý thuyệt)' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thực tập các bệp' LIMIT 1;
        IF v_sub_id IS NOT NULL THEN
            INSERT INTO curriculum_subjects (curriculum_id, subject_id, semester, is_compulsory)
            VALUES (v_curr_id, v_sub_id, 1, true)
            ON CONFLICT (curriculum_id, subject_id) DO NOTHING;
        END IF;


        SELECT id INTO v_sub_id FROM subjects WHERE name = 'Thực hành chệ biện giệt mổ' LIMIT 1;
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

COMMIT;
