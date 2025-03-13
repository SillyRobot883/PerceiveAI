document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // EmailJS integration
        emailjs.init({ publicKey: "3imlIrwKb3DtcKUTM"});

        const serviceID = 'service_xjzpcdd'; // Replace with your EmailJS service ID
        const templateID = 'template_4hgv99a'; // Replace with your EmailJS template ID

        const templateParams = {
            name: name,
            email: email,
            message: message
        };

        emailjs.send(serviceID, templateID, templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('تم إرسال رسالتك بنجاح! سنقوم بالرد عليك قريباً.');
                contactForm.reset();
            }, function(error) {
                console.error('FAILED...', error);
                alert('حدث خطأ أثناء إرسال رسالتك. حاول مرة أخرى لاحقاً.');
            });
    });
});