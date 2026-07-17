
document.addEventListener("DOMContentLoaded", () => {
  const isMobileDevice = () => {
    const uaMobile =
      navigator.userAgentData?.mobile === true ||
      /Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const touchMobile =
      (window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0) &&
      window.matchMedia("(max-width: 1024px)").matches;

    return uaMobile || touchMobile;
  };

  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.href = "tel:01023550943";
    link.dataset.mobileCall = "";

    link.addEventListener("click", (event) => {
      if (!isMobileDevice()) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  });

  document.querySelectorAll('a[href^="sms:"]').forEach((link) => {
    link.href = "sms:01023550943";
    link.dataset.mobileSms = "";

    link.addEventListener("click", (event) => {
      if (!isMobileDevice()) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  });
});
