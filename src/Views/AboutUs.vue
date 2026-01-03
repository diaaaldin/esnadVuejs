<template>
  <div class="about-us-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <!-- Header Section -->
          <div class="text-center mb-5">
            <h1 class="display-4 mb-3">من نحن</h1>
            <p class="lead text-muted">إسناد - منصة إدارة المشاريع والتمويل</p>
          </div>

          <!-- Main Content -->
          <div class="card shadow-sm border-0 mb-4">
            <div class="card-body p-5">
              <div class="row">
                <div class="col-md-12">
                  <h2 class="mb-4">عن إسناد</h2>
                  <p class="text-justify mb-4">
                    إسناد هي منصة متكاملة لإدارة المشاريع والتمويل، مصممة لتسهيل عملية إدارة المشاريع الخيرية والتنموية بكفاءة عالية. 
                    تهدف المنصة إلى ربط الممولين بالمشاريع المختلفة وتوفير أدوات شاملة لإدارة الموارد المالية والبشرية.
                  </p>

                  <h3 class="mb-3 mt-5">رؤيتنا</h3>
                  <p class="text-justify mb-4">
                    نسعى لأن نكون المنصة الرائدة في إدارة المشاريع الخيرية والتنموية في المنطقة، من خلال توفير حلول تقنية متقدمة 
                    تساهم في تحقيق أقصى استفادة من الموارد المتاحة وتأمين الشفافية الكاملة في العمليات المالية.
                  </p>

                  <h3 class="mb-3 mt-5">مهمتنا</h3>
                  <p class="text-justify mb-4">
                    توفير نظام إدارة شامل وسهل الاستخدام يتيح للمؤسسات والجمعيات الخيرية إدارة مشاريعها بكفاءة، 
                    مع ضمان الشفافية والمحاسبة الدقيقة في جميع العمليات المالية والإدارية.
                  </p>

                  <h3 class="mb-3 mt-5">ما نقدمه</h3>
                  <ul class="list-unstyled">
                    <li class="mb-3">
                      <i class="fa fa-check-circle text-success me-2"></i>
                      <strong>إدارة المشاريع:</strong> تتبع شامل للمشاريع من البداية حتى النهاية
                    </li>
                    <li class="mb-3">
                      <i class="fa fa-check-circle text-success me-2"></i>
                      <strong>إدارة الممولين:</strong> قاعدة بيانات متكاملة للممولين وطرق التمويل
                    </li>
                    <li class="mb-3">
                      <i class="fa fa-check-circle text-success me-2"></i>
                      <strong>الإدارة المالية:</strong> تتبع دقيق للدخل والمصروفات والمحافظ المالية
                    </li>
                    <li class="mb-3">
                      <i class="fa fa-check-circle text-success me-2"></i>
                      <strong>إدارة الفرق:</strong> تنظيم الفرق والمتطوعين والمشاركين في المشاريع
                    </li>
                    <li class="mb-3">
                      <i class="fa fa-check-circle text-success me-2"></i>
                      <strong>التقارير:</strong> تقارير شاملة ومرئية لاتخاذ القرارات المدروسة
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Section -->
          <div class="card shadow-sm border-0">
            <div class="card-body p-5">
              <h3 class="mb-4">تواصل معنا</h3>
              <p class="mb-4">
                إذا كان لديك أي استفسارات أو تحتاج إلى مساعدة، لا تتردد في التواصل معنا.
              </p>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <p><i class="fa fa-globe me-2"></i> <strong>الموقع:</strong> <a href="https://esnad.cloud" target="_blank">esnad.cloud</a></p>
                </div>
              </div>
            </div>
          </div>

          <!-- Back to Login -->
          <div class="text-center mt-4">
            <router-link to="/login" class="btn btn-primary btn-lg">
              <i class="fa fa-sign-in me-2"></i>تسجيل الدخول
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUs',
  mounted() {
    // Set page title
    document.title = 'من نحن - إسناد';
    
    // Add meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'إسناد - منصة متكاملة لإدارة المشاريع والتمويل. نقدم حلول تقنية متقدمة لإدارة المشاريع الخيرية والتنموية بكفاءة عالية.';
      document.head.appendChild(meta);
    }
  }
}
</script>

<style scoped>
.about-us-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;
}

.card {
  border-radius: 15px;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

h1, h2, h3 {
  color: #2c3e50;
  font-weight: 600;
}

.list-unstyled li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.list-unstyled li:last-child {
  border-bottom: none;
}

.text-justify {
  text-align: justify;
  line-height: 1.8;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

a {
  color: #667eea;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>

