// Nội dung các trang chính sách & hỗ trợ - lấy từ footer.md
// Mỗi trang: { slug, title, sections: [{ heading?, paragraphs?, bullets? }] }

export const FOOTER_PAGES = {
  "huong-dan-mua-hang": {
    title: "Hướng dẫn mua hàng",
    group: "Hỗ trợ khách hàng",
    sections: [
      {
        paragraphs: [
          "Để quy trình mua sắm tại Haco trở nên đơn giản và dễ dàng nhất, bạn có thể thực hiện theo các bước hướng dẫn sau đây.",
          "Đầu tiên, bạn bắt đầu bằng việc tìm kiếm những món đồ yêu thích thông qua các danh mục sản phẩm cụ thể như nước tẩy trang, serum, sữa rửa mặt hoặc sử dụng trực tiếp ô tìm kiếm để tiết kiệm thời gian. Khi đã chọn được sản phẩm ưng ý, bạn chỉ cần điều chỉnh số lượng phù hợp rồi nhấn nút thêm vào giỏ hàng.",
          "Sau khi đã chọn xong các sản phẩm cần thiết, bạn hãy truy cập vào giỏ hàng để kiểm tra lại danh sách một lần nữa. Đây cũng là lúc bạn nhập mã giảm giá nếu có để hưởng các ưu đãi từ Haco trước khi tiến hành thanh toán. Tại bước tiếp theo, bạn vui lòng cung cấp đầy đủ các thông tin cá nhân cơ bản bao gồm họ tên, số điện thoại và địa chỉ chính xác để đơn vị vận chuyển có thể liên hệ giao hàng thuận tiện nhất.",
          "Cuối cùng, bạn chỉ cần nhấn nút đặt hàng để hoàn tất. Ngay khi giao dịch được ghi nhận, hệ thống sẽ tự động gửi thông báo xác nhận đơn hàng thành công và đội ngũ của Haco sẽ nhanh chóng chuẩn bị để gửi sản phẩm đến tận tay bạn.",
        ],
      },
    ],
  },

  "phuong-thuc-thanh-toan": {
    title: "Phương thức thanh toán",
    group: "Hỗ trợ khách hàng",
    sections: [
      {
        paragraphs: [
          "Tại Haco, chúng mình ưu tiên sự an tâm và tin tưởng tuyệt đối từ khách hàng trong mỗi giao dịch. Chính vì vậy, hiện tại Haco áp dụng hình thức Thanh toán khi nhận hàng (COD) cho tất cả các đơn hàng trên toàn quốc.",
          "Với phương thức này, quá trình mua sắm của bạn sẽ trở nên vô cùng đơn giản và an toàn. Sau khi lựa chọn được những sản phẩm ưng ý trên website, bạn chỉ cần hoàn tất thông tin đặt hàng mà không cần phải thực hiện bất kỳ thao tác chuyển khoản phức tạp nào trước đó.",
          "Khi nhân viên giao hàng mang sản phẩm đến tận tay, bạn hoàn toàn có thể kiểm tra sơ bộ về tình trạng đóng gói cũng như số lượng sản phẩm bên trong kiện hàng. Chỉ sau khi đã hài lòng và xác nhận đúng đơn hàng mình đã đặt, bạn mới thực hiện thanh toán tiền mặt trực tiếp cho người giao hàng. Phương thức này giúp bạn hoàn toàn chủ động và yên tâm về chất lượng dịch vụ cũng như sản phẩm của Haco trước khi thực sự chi trả.",
        ],
      },
    ],
  },

  "cau-hoi-thuong-gap": {
    title: "Câu hỏi thường gặp (FAQ)",
    group: "Hỗ trợ khách hàng",
    sections: [
      {
        bullets: [
          "Sản phẩm có chính hãng không? Haco cam kết bán hàng 100% chính hãng, có đầy đủ tem phụ tiếng việt và hóa đơn chứng từ nhập hàng.",
          "Bao lâu thì tôi nhận được hàng? Từ 1-3 ngày (khu vực miền bắc) và 3-5 ngày (các tỉnh thành khác).",
          "Tôi có được kiểm tra hàng trước khi thanh toán không? Có. Haco cho phép khách hàng kiểm tra ngoại quan (số lượng, tên sản phẩm, bao bì). Tuy nhiên để đảm bảo, bạn vui lòng không mở seal hoặc dùng thử sản phẩm khi chưa thanh toán.",
          "Làm sao để tôi biết sản phẩm có phù hợp với da mình không? Tại mỗi trang sản phẩm, Haco đều ghi rõ \"Loại da phù hợp\". Nếu bạn vẫn băn khoăn, hãy nhấn vào biểu tượng Messenger hoặc Zalo ở góc màn hình để được Haco tư vấn sản phẩm phù hợp trước khi mua.",
          "Tôi đã đặt hàng nhưng muốn thay đổi địa chỉ hoặc sản phẩm thì làm thế nào? Bạn vui lòng gọi ngay hotline 0979 928 612 trong vòng 30 phút kể từ khi đặt hàng. Nếu đơn hàng chưa xuất kho, Haco sẽ hỗ trợ điều chỉnh miễn phí cho bạn.",
        ],
      },
    ],
  },

  "lien-he-chung-toi": {
    title: "Liên hệ chúng tôi",
    group: "Hỗ trợ khách hàng",
    sections: [
      {
        paragraphs: [
          "Để được hỗ trợ nhanh nhất về tình trạng da hoặc thông tin đơn hàng, bạn có thể gọi trực tiếp đến số hotline 0979 928 612. Đội ngũ chuyên viên của Haco luôn sẵn sàng lắng nghe và tư vấn tận tình cho bạn tất cả các ngày trong tuần.",
          "Ngoài ra, bạn có thể nhắn tin trực tiếp cho Haco thông qua các kênh Zalo hoặc Fanpage Facebook bằng cách nhấn vào biểu tượng chat ngay góc màn hình. Đây là cách nhanh nhất để bạn gửi hình ảnh tình trạng da hoặc ảnh sản phẩm, giúp chuyên viên đưa ra lời khuyên chính xác và kịp thời nhất cho bạn.",
          "Trong trường hợp cần trao đổi các vấn đề về hợp tác hoặc khiếu nại bằng văn bản, bạn vui lòng gửi thư về địa chỉ email: haco.tmdv@gmail.com. Chúng mình cam kết sẽ tiếp nhận và phản hồi thông tin đến bạn trong vòng 24 giờ làm việc.",
        ],
      },
    ],
  },

  "chinh-sach-ban-hang": {
    title: "Chính sách bán hàng",
    group: "Chính sách",
    sections: [
      {
        paragraphs: [
          "Tại Haco, chúng mình luôn đặt sự hài lòng và sức khỏe làn da của khách hàng lên hàng đầu. Để đảm bảo bạn có trải nghiệm mua sắm an tâm nhất, Haco cam kết thực hiện các quy định bán hàng minh bạch sau đây:",
          "Trước hết, Haco cam kết mọi sản phẩm được phân phối trên website đều là hàng chính hãng 100%, có nguồn gốc xuất xứ rõ ràng, có tem phụ tiếng việt và hóa đơn chứng từ nhập hàng đầy đủ. Chúng mình nói không với hàng giả, hàng kém chất lượng và sẵn sàng chịu trách nhiệm cao nhất nếu có bất kỳ sai sót nào về nguồn gốc sản phẩm.",
          "Về giá cả, tất cả sản phẩm đều được niêm yết công khai và chính xác trên website. Haco luôn nỗ lực mang đến mức giá tốt nhất đi kèm với các chương trình ưu đãi, quà tặng hấp dẫn nhằm tri ân khách hàng. Các chương trình khuyến mãi sẽ được thông báo rộng rãi và áp dụng thống nhất trên toàn hệ thống để đảm bảo quyền lợi cho mọi người mua.",
          "Bên cạnh đó, đội ngũ nhân viên của Haco luôn sẵn sàng tư vấn tận tình dựa trên tình trạng da thực tế của bạn. Chúng mình không chỉ bán sản phẩm, mà còn mong muốn mang lại giải pháp làm đẹp hiệu quả và an toàn nhất. Mọi ý kiến đóng góp hoặc phản hồi về dịch vụ từ phía bạn luôn là động lực để Haco cải thiện và phục vụ tốt hơn mỗi ngày.",
        ],
      },
    ],
  },

  "chinh-sach-giao-kiem-hang": {
    title: "Chính sách giao & Kiểm hàng",
    group: "Chính sách",
    sections: [
      {
        paragraphs: [
          "Haco luôn mong muốn sản phẩm đến tay bạn một cách hoàn hảo và nhanh chóng nhất. Hiện tại, chúng mình hợp tác với các đơn vị vận chuyển uy tín để đảm bảo hàng hóa được bảo quản cẩn thận trong suốt hành trình di chuyển.",
          "Để bảo vệ quyền lợi của mình, Haco khuyến khích bạn thực hiện kiểm hàng ngay khi nhận. Cụ thể, bạn có thể kiểm tra các thông tin bên ngoài như số lượng sản phẩm, tên sản phẩm và tình trạng đóng gói xem có nguyên vẹn hay không trước khi thanh toán cho nhân viên giao hàng.",
        ],
      },
      {
        heading: "Lưu ý:",
        paragraphs: [
          "Vì lý do vệ sinh và an toàn cho các sản phẩm chăm sóc da, chúng mình không hỗ trợ việc mở seal (tem niêm phong) hoặc dùng thử sản phẩm trong quá trình kiểm hàng. Tuy nhiên, nếu phát hiện sản phẩm bị móp méo, đổ vỡ hoặc không đúng với đơn hàng đã đặt, bạn hoàn toàn có quyền từ chối nhận hàng và báo ngay cho Hotline của Haco để được hỗ trợ gửi bù đơn mới hoàn toàn miễn phí.",
          "Haco cũng khuyên bạn nên quay lại video quá trình mở kiện hàng. Đây sẽ là bằng chứng xác thực nhất giúp chúng mình xử lý nhanh chóng các khiếu nại phát sinh và đảm bảo bạn luôn nhận được sự hỗ trợ tốt nhất.",
        ],
      },
    ],
  },

  "chinh-sach-van-chuyen": {
    title: "Chính sách vận chuyển",
    group: "Chính sách",
    sections: [
      {
        heading: "1. Phạm vi và đơn vị vận chuyển",
        paragraphs: [
          "Haco cung cấp dịch vụ giao hàng tận nơi trên toàn quốc. Để đảm bảo hàng hóa đến tay khách hàng nhanh chóng và an toàn, chúng tôi hiện đang hợp tác cùng đơn vị vận chuyển SPX. Mọi đơn hàng đều được theo dõi sát sao trên hệ thống từ khi rời kho cho đến khi bàn giao hoàn tất cho quý khách.",
        ],
      },
      {
        heading: "2. Thời gian giao hàng",
        paragraphs: ["Tùy vào khoảng cách địa lý, thời gian bạn nhận được hàng sẽ có sự khác biệt:"],
        bullets: [
          "Các khu vực miền Bắc: Thường mất khoảng 1 - 3 ngày làm việc.",
          "Các tỉnh thành còn lại: Thường mất khoảng 3 - 5 ngày làm việc.",
        ],
        paragraphsAfter: [
          "Tuy nhiên, thời gian giao hàng có thể kéo dài hơn dự kiến do các yếu tố bất khả kháng như thời tiết, thiên tai hoặc sự cố vận hành từ phía đơn vị vận chuyển. Haco rất mong quý khách thông cảm và sẽ tích cực phối hợp cùng đơn vị vận chuyển để đơn hàng sớm đến tay bạn.",
        ],
      },
      {
        heading: "3. Chi phí vận chuyển",
        paragraphs: [
          "Haco không áp dụng mức phí cố định mà sẽ dựa trên biểu phí niêm yết của đơn vị vận chuyển. Chi phí này được tính toán tự động dựa trên tổng khối lượng sản phẩm và địa chỉ nhận hàng của bạn. Chúng tôi cam kết mức phí luôn minh bạch và được thông báo rõ ràng trước khi bạn hoàn tất đặt hàng.",
        ],
      },
      {
        heading: "4. Đảm bảo quyền lợi khi nhận hàng",
        paragraphs: [
          "Đơn vị vận chuyển sẽ chịu trách nhiệm bảo đảm an toàn cho hàng hóa suốt quá trình lưu thông. Tuy nhiên, để bảo vệ quyền lợi cá nhân, bạn vui lòng kiểm tra kỹ kiện hàng khi nhân viên giao đến:",
        ],
        bullets: [
          "Nếu thấy sản phẩm có dấu hiệu bị hư hỏng, bể vỡ hoặc không đúng sản phẩm đã đặt, hãy ký xác nhận tình trạng với shipper và liên hệ ngay với Hotline của Haco.",
          "Việc ký nhận mà không kèm theo khiếu nại tại chỗ đồng nghĩa với việc đơn hàng đã được bàn giao hoàn tất và đúng yêu cầu. Haco sẽ rất khó hỗ trợ các khiếu nại về hỏng hóc hay thiếu sót phát sinh sau thời điểm này.",
        ],
      },
      {
        heading: "5. Hỗ trợ trực tiếp",
        paragraphs: [
          "Nếu bạn có bất kỳ thắc mắc nào về đơn hàng và dịch vụ vận chuyển, đừng ngần ngại gọi cho chúng tôi qua hotline 0979 928 612. Đội ngũ CSKH luôn sẵn lòng hỗ trợ bạn nhanh nhất có thể.",
        ],
      },
    ],
  },

  "chinh-sach-doi-tra-hoan-tien": {
    title: "Chính sách đổi trả & Hoàn tiền",
    group: "Chính sách",
    sections: [
      {
        heading: "1. Điều kiện áp dụng đổi trả",
        paragraphs: ["Quý khách có thể yêu cầu đổi trả sản phẩm trong vòng 7 ngày kể từ khi nhận hàng thành công, nếu thuộc các trường hợp sau:"],
        bullets: [
          "Sản phẩm bị lỗi do nhà sản xuất (hết hạn sử dụng, bao bì hư hỏng nặng).",
          "Sản phẩm bị đổ vỡ, hư hại do quá trình vận chuyển.",
          "Giao sai mẫu mã, chủng loại hoặc thiếu số lượng so với đơn hàng đã đặt.",
        ],
      },
      {
        heading: "2. Yêu cầu đối với sản phẩm đổi trả",
        paragraphs: ["Để quá trình xử lý được diễn đạt nhanh nhất, sản phẩm cần đáp ứng các tiêu chí:"],
        bullets: [
          "Sản phẩm còn nguyên vẹn tem niêm phong (seal), chưa qua sử dụng và đầy đủ bao bì đi kèm.",
          "Quý khách vui lòng cung cấp Video quay lại quá trình mở kiện hàng để làm căn cứ xác thực tình trạng hàng hóa lúc nhận. Haco có quyền từ chối hỗ trợ nếu không có bằng chứng hình ảnh/video rõ ràng.",
        ],
      },
      {
        heading: "3. Quy trình thực hiện",
        paragraphs: [
          "Bước 1: Liên hệ Hotline 0979 928 612 hoặc nhắn tin qua Zalo/Fanpage để thông báo về tình trạng đơn hàng.",
          "Bước 2: Sau khi xác nhận thông tin, Haco sẽ hướng dẫn quý khách gửi hàng về kho để kiểm tra.",
          "Bước 3: Haco tiến hành gửi sản phẩm thay thế hoặc hoàn tiền theo thỏa thuận trong vòng 3-5 ngày làm việc.",
        ],
      },
      {
        heading: "4. Chính sách hoàn tiền",
        paragraphs: [
          "Trong trường hợp quý khách không muốn đổi sang sản phẩm khác, Haco sẽ thực hiện hoàn trả giá trị đơn hàng qua hình thức chuyển khoản ngân hàng.",
          "Số tiền hoàn lại sẽ bao gồm giá trị sản phẩm và phí vận chuyển (nếu lỗi hoàn toàn từ phía Haco).",
          "Nếu lý do đổi trả xuất phát từ nhu cầu cá nhân của khách hàng (không thích mẫu, chọn nhầm...), quý khách vui lòng thanh toán phí vận chuyển phát sinh.",
        ],
      },
      {
        heading: "5. Các trường hợp không hỗ trợ đổi trả",
        bullets: [
          "Sản phẩm đã bóc seal, đã qua sử dụng hoặc bị hư hỏng do lỗi bảo quản từ phía khách hàng.",
          "Quá thời gian quy định về việc phản hồi đơn hàng.",
          "Hàng quà tặng kèm trong các chương trình khuyến mãi.",
        ],
      },
    ],
  },

  "chinh-sach-bao-mat": {
    title: "Chính sách bảo mật",
    group: "Chính sách",
    sections: [
      {
        heading: "1. Mục đích thu thập thông tin cá nhân",
        paragraphs: [
          "Haco thu thập thông tin khách hàng chủ yếu để phục vụ quá trình xử lý đơn hàng và nâng cao chất lượng dịch vụ. Các dữ liệu như họ tên, số điện thoại, địa chỉ giao hàng và email giúp chúng tôi xác nhận giao dịch, vận chuyển sản phẩm chính xác và kịp thời hỗ trợ các vấn đề phát sinh. Ngoài ra, thông tin này còn được sử dụng để gửi thông báo về các chương trình khuyến mãi hoặc cập nhật quan trọng từ Haco nếu quý khách có nhu cầu nhận tin.",
        ],
      },
      {
        heading: "2. Phạm vi sử dụng và bảo mật dữ liệu",
        paragraphs: [
          "Chúng tôi cam kết chỉ sử dụng thông tin cá nhân của quý khách trong nội bộ hệ thống Haco cho các mục đích liên quan đến bán hàng và hậu mãi. Haco tuyệt đối không bán, chia sẻ hay trao đổi dữ liệu cá nhân của khách hàng cho bất kỳ bên thứ ba nào vì mục đích thương mại khi chưa được sự đồng ý của chính chủ.",
        ],
      },
      {
        heading: "3. Chia sẻ thông tin với đối tác vận chuyển",
        paragraphs: [
          "Để hoàn tất việc giao hàng, Haco sẽ cung cấp một số thông tin cần thiết như tên, địa chỉ và số điện thoại cho đối tác vận chuyển. Đây là quy trình bắt buộc trong việc thực hiện hợp đồng mua bán giữa quý khách và Haco. Các đối tác giao hàng cũng có trách nhiệm bảo mật thông tin này và chỉ được phép sử dụng trong phạm vi thực hiện nhiệm vụ giao nhận hàng hóa.",
        ],
      },
      {
        heading: "4. Quyền lợi của khách hàng và cơ chế giải quyết khiếu nại",
        paragraphs: [
          "Quý khách có quyền yêu cầu truy cập, chỉnh sửa hoặc xóa bỏ thông tin cá nhân của mình khỏi hệ thống lưu trữ của Haco bất cứ lúc nào. Trong trường hợp quý khách nghi ngờ thông tin cá nhân bị sử dụng sai mục đích hoặc ngoài phạm vi đã thông báo, vui lòng gửi phản hồi ngay lập tức qua hotline 0979 928 612 hoặc email hỗ trợ. Haco cam kết sẽ tiếp nhận khiếu nại, tiến hành kiểm tra dữ liệu và phản hồi kết quả giải quyết cho quý khách trong thời gian sớm nhất. Chúng tôi sẵn sàng phối hợp với các cơ quan chức năng để xử lý nếu phát hiện các vi phạm gây ảnh hưởng đến quyền lợi của người tiêu dùng.",
        ],
      },
      {
        heading: "5. Cam kết tuân thủ quy định pháp luật",
        paragraphs: [
          "Chính sách bảo mật của Haco được xây dựng dựa trên sự tôn trọng quyền riêng tư của khách hàng và tuân thủ chặt chẽ các quy định của pháp luật hiện hành về bảo vệ dữ liệu cá nhân. Chúng tôi không ngừng cập nhật và hoàn thiện các quy trình quản lý dữ liệu để đảm bảo quý khách luôn có một môi trường mua sắm trực tuyến an toàn, minh bạch và tin cậy.",
        ],
      },
    ],
  },

  "chinh-sach-quy-dinh-chung": {
    title: "Chính sách và quy định chung",
    group: "Chính sách",
    sections: [
      {
        heading: "1. Điều kiện sử dụng và Tài khoản người dùng",
        paragraphs: [
          "Để thực hiện giao dịch, người dùng cần đảm bảo có đầy đủ năng lực hành vi dân sự theo quy định của pháp luật. Khi đăng ký thành viên, bạn có trách nhiệm cung cấp thông tin cá nhân chính xác và tự bảo mật mật khẩu truy cập của mình. Haco không chịu trách nhiệm cho bất kỳ tổn thất nào phát sinh từ việc bạn không tuân thủ quy định bảo mật tài khoản. Chúng tôi có quyền tạm khóa hoặc hủy tài khoản nếu phát hiện hành vi gian lận hoặc vi phạm các quy tắc ứng xử chung.",
        ],
      },
      {
        heading: "2. Xác nhận đơn hàng và Giá niêm yết",
        paragraphs: [
          "Haco nỗ lực đảm bảo mọi thông tin sản phẩm và giá cả hiển thị trên hệ thống là chính xác nhất. Tuy nhiên, trong một số trường hợp sai sót kỹ thuật khách quan, chúng tôi có quyền từ chối hoặc hủy đơn hàng (dù đã thanh toán hay chưa). Nếu đơn hàng bị hủy khi bạn đã thanh toán, Haco cam kết hoàn trả đầy đủ số tiền theo phương thức phù hợp. Lưu ý rằng mức giá hiển thị là giá bán cuối cùng của sản phẩm, chưa bao gồm chi phí vận chuyển.",
        ],
      },
      {
        heading: "3. Điều khoản về các tình huống bất khả kháng",
        paragraphs: [
          "Quy trình phục vụ của Haco có thể bị gián đoạn hoặc không diễn ra đúng cam kết do các nguyên nhân ngoài tầm kiểm soát như: thiên tai, dịch bệnh, sự cố hạ tầng viễn thông toàn cầu, hoặc các vấn đề kỹ thuật từ bên thứ ba. Trong những trường hợp bất khả kháng này, Haco được miễn trừ trách nhiệm về việc chậm trễ nhưng sẽ nỗ lực phối hợp tối đa để bảo vệ quyền lợi chính đáng cho bạn ngay khi điều kiện cho phép.",
        ],
      },
      {
        heading: "4. Thay đổi giao dịch và Khiếu nại",
        paragraphs: [
          "Quý khách có quyền thay đổi hoặc chấm dứt giao dịch trước khi hàng được bàn giao cho đơn vị vận chuyển bằng cách liên hệ hotline 0979 928 612. Đối với các khiếu nại về chất lượng sản phẩm, Haco rất mong nhận được sự hợp tác từ bạn thông qua việc cung cấp thông tin chi tiết (mã đơn hàng, video mở kiện hàng) để chúng tôi có căn cứ giải quyết nhanh nhất theo đúng Chính sách đổi trả đã công bố.",
        ],
      },
      {
        heading: "5. Thực thi pháp luật và Giải quyết tranh chấp",
        paragraphs: [
          "Mọi quy định và giao dịch giữa khách hàng và Haco đều được điều chỉnh và hiểu theo luật pháp hiện hành của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Trong trường hợp phát sinh tranh chấp không thể giải quyết thông qua thương lượng, hòa giải, quý khách hàng có quyền gửi khiếu nại/khiếu kiện lên Tòa án có thẩm quyền tại Việt Nam để giải quyết.",
        ],
      },
    ],
  },
};

export const SUPPORT_LINKS = [
  { slug: "huong-dan-mua-hang", label: "Hướng dẫn mua hàng" },
  { slug: "phuong-thuc-thanh-toan", label: "Phương thức thanh toán" },
  { slug: "cau-hoi-thuong-gap", label: "Câu hỏi thường gặp (FAQ)" },
  { slug: "lien-he-chung-toi", label: "Liên hệ chúng tôi" },
];

export const POLICY_LINKS = [
  { slug: "chinh-sach-ban-hang", label: "Chính sách bán hàng" },
  { slug: "chinh-sach-giao-kiem-hang", label: "Chính sách giao & Kiểm hàng" },
  { slug: "chinh-sach-van-chuyen", label: "Chính sách vận chuyển" },
  { slug: "chinh-sach-doi-tra-hoan-tien", label: "Chính sách đổi trả & Hoàn tiền" },
  { slug: "chinh-sach-bao-mat", label: "Chính sách bảo mật" },
  { slug: "chinh-sach-quy-dinh-chung", label: "Chính sách và quy định chung" },
];
