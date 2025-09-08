package com.kisa.calnotify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;


    private void sendMail(String to,String subject,String templateName,Context context) throws MessagingException{

        String htmlContent = templateEngine.process(templateName,context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        mailSender.send(message);


    }

    public void sendOrganizerMail(String to,String name,String eventTitle,String description,String start,String end) throws MessagingException{

         Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("eventTitle", eventTitle);
        context.setVariable("description", description);
        context.setVariable("start", start);
        context.setVariable("end", end);

        sendMail(to, "Event Created: " + eventTitle, "organizerEmail", context);
    }

    public void participantsMail(String to,String name,String eventTitle,String description, String start,String end)throws MessagingException{


        Context context = new Context();
        context.setVariable("name",name);
        context.setVariable("eventTitle", eventTitle);
        context.setVariable("description", description);
        context.setVariable("start", start);
        context.setVariable("end", end);
        sendMail(to, "You're Invited"+ eventTitle,"participantEmail", context);

    }




    
}
