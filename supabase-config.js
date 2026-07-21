window.NBMASTER_SUPABASE = {
  url: "https://mghtpawavjhmfrtployf.supabase.co",
  key: "sb_publishable_ghe-qte95tyKMgkdf_JfoA_tH1Y4DgE",
  adminEmail: "nbmaster1223@naver.com"
};

if (window.supabase && !window.nbSupabase) {
  window.nbSupabase = window.supabase.createClient(
    window.NBMASTER_SUPABASE.url,
    window.NBMASTER_SUPABASE.key
  );
}
