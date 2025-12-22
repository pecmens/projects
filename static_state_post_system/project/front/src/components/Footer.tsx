const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">© {currentYear} SSPS - 静态状态发布系统</p>
          <p className="text-sm">一个轻量级的博客生成与管理系统</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;