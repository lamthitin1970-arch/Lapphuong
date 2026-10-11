import React from 'react';
import { X, Lightbulb, BookOpen, Layers, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';

interface TheoryGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryGuideModal: React.FC<TheoryGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-sky-500 to-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            <h2 className="text-lg font-bold">Bí Quyết Đếm Khối Lập Phương - Toán Lớp 2</h2>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
          {/* Card 1: Khái niệm */}
          <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
            <div className="flex items-start gap-3">
              <span className="p-2 bg-sky-600 text-white rounded-lg font-bold text-sm shrink-0">
                01
              </span>
              <div>
                <h3 className="font-bold text-sky-950 text-base mb-1">
                  Khối lập phương là gì?
                </h3>
                <p className="text-sm text-sky-900 leading-relaxed">
                  Khối lập phương là hình khối có <strong>6 mặt đều là hình vuông</strong> bằng nhau (như con xúc xắc hoặc khối rubik). Khi xếp nhiều khối lập phương nhỏ lại với nhau, ta được các hình tháp, hình chữ U, bậc thang...
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Bí kíp đếm theo tầng */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-3">
              <span className="p-2 bg-amber-600 text-white rounded-lg font-bold text-sm shrink-0">
                02
              </span>
              <div>
                <h3 className="font-bold text-amber-950 text-base mb-1 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-600" />
                  Phương pháp vàng 1: Đếm theo từng tầng (Khuyên dùng)
                </h3>
                <p className="text-sm text-amber-900 mb-2">
                  Bóc tách ngôi nhà thành từng tầng từ trên xuống dưới hoặc từ dưới lên trên:
                </p>
                <div className="space-y-1.5 text-xs text-amber-950 bg-white/80 p-3 rounded-lg border border-amber-200 font-medium">
                  <p>• <strong>Tầng 3 (trên cùng):</strong> Đếm có bao nhiêu khối.</p>
                  <p>• <strong>Tầng 2 (tầng giữa):</strong> Đếm có bao nhiêu khối.</p>
                  <p>• <strong>Tầng 1 (tầng đáy):</strong> Đếm có bao nhiêu khối.</p>
                  <p className="text-amber-700 font-bold mt-1 text-sm">
                    ➔ Tổng số khối = (Số khối Tầng 1) + (Số khối Tầng 2) + (Số khối Tầng 3)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Khối bị che khuất */}
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-rose-950 text-base mb-1">
                  Mẹo ghi nhớ quan trọng: "Khối ẩn bên dưới"
                </h3>
                <p className="text-sm text-rose-900 leading-relaxed">
                  Trong thực tế, các khối lập phương không thể lơ lửng trên không trung! Nếu ở tầng 2 có 1 khối, thì <strong>chắc chắn ngay phía dưới nó ở tầng 1 phải có 1 khối làm chân đỡ</strong>, cho dù mắt ta không nhìn thấy!
                </p>
                <div className="mt-2 text-xs text-rose-800 bg-white/80 p-2.5 rounded-lg border border-rose-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    Bé có thể bấm nút <strong>"Nhìn X-Ray"</strong> hoặc <strong>"Bóc tách từng tầng"</strong> trong ứng dụng để nhìn thấu các khối ẩn này nhé!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Phương pháp đếm theo cột */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="flex items-start gap-3">
              <span className="p-2 bg-emerald-600 text-white rounded-lg font-bold text-sm shrink-0">
                03
              </span>
              <div>
                <h3 className="font-bold text-emerald-950 text-base mb-1">
                  Phương pháp vàng 2: Đếm theo cột độ cao
                </h3>
                <p className="text-sm text-emerald-900 mb-2">
                  Nhìn vào từng cột xem mỗi cột có bao nhiêu khối chồng lên nhau:
                </p>
                <p className="text-xs text-emerald-950 bg-white/80 p-2.5 rounded-lg border border-emerald-200">
                  Ví dụ: Có 2 cột cao 3 khối (3 + 3 = 6), có 1 cột cao 1 khối (+ 1 = 7). Tổng cộng là 7 khối!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-xl transition-colors shadow-xs"
          >
            Bé Đã Hiểu Rõ, Đi Luyện Tập Nào!
          </button>
        </div>
      </div>
    </div>
  );
};
