export type Locale = 'en' | 'ur'

export const strings = {
  en: {
    // Nav
    home: 'Home',
    store: 'My Store',
    orders: 'Orders',
    earnings: 'Earnings',
    learn: 'Learn',
    profile: 'Profile',
    settings: 'Settings',

    // Dashboard
    assalam: 'Assalam-u-Alaikum',
    thisMonth: 'This Month',
    pending: 'Pending',
    rating: 'Rating',
    listProduct: 'List a new product',
    listProductSub: 'Snap a photo — AI does the rest',
    recentOrders: 'Recent orders',
    seeAll: 'See all',

    // Listing flow
    step1: 'Step 1 of 3 · Take photo',
    step2: 'Step 2 of 3',
    step3: 'Step 3 of 3 · Review',
    aiLooking: 'Saheli AI is looking…',
    aiSub: 'This usually takes under 10 seconds',
    analyzingImage: 'Analyzing image',
    identifyingCategory: 'Identifying category',
    writingListing: 'Writing your listing in Urdu + English',
    suggestingPrice: 'Suggesting a fair price',
    aiGenerated: 'AI generated this listing — review and edit anything before publishing.',
    saveDraft: 'Save draft',
    publish: 'Publish',
    publishing: 'Publishing…',
    productLive: 'Your product is live!',
    addAnother: 'Add another product',
    backHome: 'Back to home',

    // OTP / Auth
    enterNumber: 'Enter your number',
    sendCode: 'Send Code',
    verifyNumber: 'Verify your number',
    verify: 'Verify',
    resendIn: "Didn't get it? Resend in",
    whatsappFallback: 'Try WhatsApp delivery instead',

    // Profile
    yourName: 'Your Name',
    city: 'City',
    whatMake: 'What do you make? (pick up to 3)',
    startSelling: 'Start Selling',
    saveChanges: 'Save changes',
    saved: '✓ Saved!',
    saving: 'Saving…',


    // Orders
    markReady: 'Mark ready',
    track: 'Track',
    confirm: 'Confirm',
    reportIssue: 'Report issue',

    // Earnings
    pendingPayout: 'Pending payout',
    nextPayout: 'Next payout',
    totalEarned: 'Total earned',
    commission: 'Platform commission',
    commissionNote: 'A variable commission may be automatically deducted from each sale. Payouts are processed every Tuesday and Friday.',

    // Settings
    language: 'Language',
    notifications: 'Notifications',
    privacy: 'Privacy & data',
    security: 'Account security',
    help: 'Help & support',
    logout: 'Log out',

    // Errors
    invalidNumber: 'Number galat hai — dobara daakhil karein',
    otpExpired: "Code ki meaad khatam ho gayi",
    otpLocked: 'Too many attempts. Try again in 15 minutes.',
    walletInvalid: 'Wallet number galat hai',
  },
  ur: {
    // Nav
    home: 'ہوم',
    store: 'میری دکان',
    orders: 'آرڈرز',
    earnings: 'آمدنی',
    learn: 'سیکھیں',
    profile: 'پروفائل',
    settings: 'ترتیبات',

    // Dashboard
    assalam: 'السلام علیکم',
    thisMonth: 'اس مہینے',
    pending: 'زیر التواء',
    rating: 'ریٹنگ',
    listProduct: 'نئی مصنوعات کی فہرست بنائیں',
    listProductSub: 'تصویر لیں — AI باقی کام کرے گا',
    recentOrders: 'حالیہ آرڈرز',
    seeAll: 'سب دیکھیں',

    // Listing flow
    step1: 'مرحلہ ۱ از ۳ · تصویر لیں',
    step2: 'مرحلہ ۲ از ۳',
    step3: 'مرحلہ ۳ از ۳ · جائزہ',
    aiLooking: 'سہیلی AI دیکھ رہی ہے…',
    aiSub: 'یہ عام طور پر ۱۰ سیکنڈ سے کم لیتا ہے',
    analyzingImage: 'تصویر کا تجزیہ',
    identifyingCategory: 'زمرہ شناخت',
    writingListing: 'اردو اور انگریزی میں فہرست لکھنا',
    suggestingPrice: 'مناسب قیمت تجویز کرنا',
    aiGenerated: 'AI نے یہ فہرست بنائی — شائع کرنے سے پہلے کچھ بھی ترمیم کریں۔',
    saveDraft: 'ڈرافٹ محفوظ کریں',
    publish: 'شائع کریں',
    publishing: 'شائع ہو رہا ہے…',
    productLive: 'آپ کی مصنوع لائیو ہے!',
    addAnother: 'ایک اور مصنوع شامل کریں',
    backHome: 'ہوم پر واپس',

    // OTP / Auth
    enterNumber: 'اپنا نمبر درج کریں',
    sendCode: 'کوڈ بھیجیں',
    verifyNumber: 'اپنا نمبر تصدیق کریں',
    verify: 'تصدیق کریں',
    resendIn: 'نہیں ملا؟ دوبارہ بھیجیں',
    whatsappFallback: 'واٹس ایپ پر بھیجیں',

    // Profile
    yourName: 'آپ کا نام',
    city: 'شہر',
    whatMake: 'آپ کیا بناتی ہیں؟ (۳ تک چنیں)',
    startSelling: 'فروخت شروع کریں',
    saveChanges: 'محفوظ کریں',
    saved: '✓ محفوظ!',
    saving: 'محفوظ ہو رہا ہے…',


    // Orders
    markReady: 'تیار نشان زد کریں',
    track: 'ٹریک کریں',
    confirm: 'تصدیق کریں',
    reportIssue: 'مسئلہ رپورٹ کریں',

    // Earnings
    pendingPayout: 'زیر التواء ادائیگی',
    nextPayout: 'اگلی ادائیگی',
    totalEarned: 'کل کمائی',
    commission: 'پلیٹ فارم کمیشن',
    commissionNote: 'ہر فروخت سے ایک متغیر کمیشن خودکار منہا ہو سکتا ہے۔ ادائیگی ہر منگل اور جمعہ کو ہوتی ہے۔',

    // Settings
    language: 'زبان',
    notifications: 'اطلاعات',
    privacy: 'رازداری اور ڈیٹا',
    security: 'اکاؤنٹ سیکیورٹی',
    help: 'مدد اور معاونت',
    logout: 'لاگ آؤٹ',

    // Errors
    invalidNumber: 'نمبر غلط ہے — دوبارہ داخل کریں',
    otpExpired: 'کوڈ کی میعاد ختم ہو گئی',
    otpLocked: 'بہت زیادہ کوششیں۔ ۱۵ منٹ میں دوبارہ کوشش کریں۔',
    walletInvalid: 'والٹ نمبر غلط ہے',
  },
} as const

export type StringKey = keyof typeof strings.en
