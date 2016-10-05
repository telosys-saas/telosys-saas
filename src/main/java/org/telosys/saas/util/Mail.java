package org.telosys.saas.util;

import org.telosys.saas.config.Configuration;
import org.telosys.saas.config.ConfigurationHolder;

import java.util.Properties;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class Mail {

	public void send(String to, String subject, String body) {
		try {
			Configuration configuration = ConfigurationHolder.getConfiguration();
			Properties mailServerProperties;
			mailServerProperties = System.getProperties();
			mailServerProperties.put("mail.smtp.port", "587");
			mailServerProperties.put("mail.smtp.starttls.enable", "true");

			Session getMailSession;
			getMailSession = Session.getDefaultInstance(mailServerProperties, null);

			MimeMessage generateMailMessage;
			generateMailMessage = new MimeMessage(getMailSession);

			// From
			Address[] addresses = new Address[1];
			addresses[0] = new InternetAddress("noreply@telosys.org");
			generateMailMessage.addFrom(addresses);
			// To
			generateMailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
			// Subject
			generateMailMessage.setSubject(subject);
			// Body
			generateMailMessage.setContent(body, "text/html");

			Transport transport = getMailSession.getTransport("smtp");
			String mailUsername = configuration.getMailUsername();
			String mailPassword = configuration.getMailPassword();
			String serverMail = configuration.getServerMail();
			transport.connect(serverMail, mailUsername, mailPassword);
			transport.sendMessage(generateMailMessage, generateMailMessage.getAllRecipients());
			transport.close();
	    }
	    catch (Exception e) {  // Handle any exceptions, print error message.
	      throw new IllegalStateException("Send mail",e);
	    }
	}
}
