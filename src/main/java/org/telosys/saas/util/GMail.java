package org.telosys.saas.util;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class GMail {
	
	public void send(String to, String subject, String body) {
		try {
			Properties mailServerProperties;
			mailServerProperties = System.getProperties();
			mailServerProperties.put("mail.smtp.port", "587");
			mailServerProperties.put("mail.smtp.auth", "true");
			mailServerProperties.put("mail.smtp.starttls.enable", "true");

			Session getMailSession;
			getMailSession = Session.getDefaultInstance(mailServerProperties, null);
			
			MimeMessage generateMailMessage;
			generateMailMessage = new MimeMessage(getMailSession);
			generateMailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
			generateMailMessage.setSubject(subject);
			generateMailMessage.setContent(body, "text/html");
			
			Transport transport = getMailSession.getTransport("smtp");
			String gmailUsername = "";
			String gmailPassword = "";
			transport.connect("smtp.gmail.com", gmailUsername, gmailPassword);
			transport.sendMessage(generateMailMessage, generateMailMessage.getAllRecipients());
			transport.close();
	    }
	    catch (Exception e) {  // Handle any exceptions, print error message.
	      throw new IllegalStateException("Send mail",e);
	    }
	}
	
}
