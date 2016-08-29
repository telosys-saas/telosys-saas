package org.telosys.saas.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telosys.saas.config.Configuration;
import org.telosys.saas.config.ConfigurationHolder;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class GMail {

	static final Logger LOG = LoggerFactory.getLogger(GMail.class);

	public void send(String to, String subject, String body) {
		if (LOG.isDebugEnabled()) {
			LOG.debug("send - to=\"" + to + "\"");
		}
		try {
			Configuration configuration = ConfigurationHolder.getConfiguration();
			Properties mailServerProperties;
			mailServerProperties = System.getProperties();
			mailServerProperties.put("mail.smtp.port", "587");
			mailServerProperties.put("mail.smtp.profile", "true");
			mailServerProperties.put("mail.smtp.starttls.enable", "true");

			Session getMailSession;
			getMailSession = Session.getDefaultInstance(mailServerProperties, null);

			MimeMessage generateMailMessage;
			generateMailMessage = new MimeMessage(getMailSession);
			generateMailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
			generateMailMessage.setSubject(subject);
			generateMailMessage.setContent(body, "text/html");

			Transport transport = getMailSession.getTransport("smtp");
			String gMailUsername = configuration.getGmailUsername();
			String gMailPassword = configuration.getGmailPassword();
			if (LOG.isDebugEnabled()) {
				LOG.debug("Gmail - gMailUsername=\""+gMailUsername+"\"");
				LOG.debug("Gmail - gMailPassword=\""+gMailPassword+"\"");
			}
			transport.connect("smtp.gmail.com", gMailUsername, gMailPassword);
			transport.sendMessage(generateMailMessage, generateMailMessage.getAllRecipients());
			transport.close();
	    }
	    catch (Exception e) {  // Handle any exceptions, print error message.
			LOG.error(e.getMessage(), e);
	      	throw new IllegalStateException("Send mail",e);
	    }
		if (LOG.isDebugEnabled()) {
			LOG.debug("send - end");
		}
	}

}
