package com.yimin.easystore.wechat.util;

import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import com.yimin.easystore.wechat.pojo.WeChatReceiveXmlEntity;

import javax.servlet.http.HttpServletRequest;

import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Iterator;

/**
 * 解析接收到的微信xml，返回消息对象
 *
 */
public class WeChatReceiveXmlProcess {
    
	/**
	 * 解析微信xml消息
	 * @param request
	 * @return
	 */
	public WeChatReceiveXmlEntity getMsgEntity(HttpServletRequest request){

		WeChatReceiveXmlEntity msg = null;
		try {
            // 从request中取得输入流
            InputStream inputStream = request.getInputStream();
            // 读取输入流
            SAXReader reader = new SAXReader();
            Document document = reader.read(inputStream);
//			if (strXml.length() <= 0 || strXml == null)
//				return null;
			 
			// 将字符串转化为XML文档对象
//			Document document = DocumentHelper.parseText(strXml);
			// 获得文档的根节点
			Element root = document.getRootElement();
			// 遍历根节点下所有子节点
			Iterator<?> iter = root.elementIterator();
			
			// 遍历所有结点
//			msg = new WeChatReceiveXmlEntity();
			//利用反射机制，调用set方法
			//获取该实体的元类型
			Class<?> c = WeChatReceiveXmlEntity.class;
			msg = (WeChatReceiveXmlEntity)c.newInstance();//创建这个实体的对象
			
			while(iter.hasNext()){
				Element ele = (Element)iter.next();
				//获取set方法中的参数字段（实体类的属性）
				Field field = c.getDeclaredField(ele.getName());
				//获取set方法，field.getType())获取它的参数数据类型
				Method method = c.getDeclaredMethod("set"+ele.getName(), field.getType());
				//调用set方法
				method.invoke(msg, ele.getText());
			}
		} catch (Exception e) {
			// TODO: handle exception
        	e.printStackTrace();
		}
		return msg;
	}
}
