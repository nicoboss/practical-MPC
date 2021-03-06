// Basierend auf Roland Gisler's Java Vorlage und der SWT Übung
package re.nico.selenium;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;

public class JiffClientTester {
    WebDriver driver;

    public JiffClientTester(WebDriver driver) {
        this.driver = driver;
    }

    public boolean vueJSTest(ExtentTest test) throws InterruptedException {
        driver.get("http://127.0.0.1:5500/client/index.xhtml");
        for (int i = 0; i <= 20; ++i) {
            Thread.sleep(50);
            try {
                WebElement vue_test_button = driver.findElement(By.id("vue-test-button"));
                String vue_test_button_text = vue_test_button.getText();
                if (vue_test_button_text.equals("10")) {
                    return true;
                }
                vue_test_button.click();
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println(e.getMessage());
                test.log(Status.FAIL, "Exception: " + e.getMessage());
            }
        }
        return false;
    }


    public boolean accessWebpage(ExtentTest test) throws InterruptedException {
        driver.get("http://127.0.0.1:5500/client/index.xhtml");

        Thread.sleep(500);
        try {
            WebElement title = driver.findElement(By.id("title"));
            return title.getText().equals("Praktische sichere Multi-Party-Computation: Client");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            test.log(Status.FAIL, "Exception: " + e.getMessage());
        }
        return false;
    }


    public boolean jiffEinstellungen(String testcaseName, ExtentTest test) throws InterruptedException {
        Thread.sleep(250);
        try {
            WebElement computation_id_text_field = driver.findElement(By.id("computation_id"));
            computation_id_text_field.clear();
            computation_id_text_field.sendKeys(testcaseName);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            test.log(Status.FAIL, "Exception: " + e.getMessage());
            return false;
        }

        Thread.sleep(250);
        try {
            WebElement party_count_text_field = driver.findElement(By.id("party_count"));
            party_count_text_field.clear();
            party_count_text_field.sendKeys("2");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            test.log(Status.FAIL, "Exception: " + e.getMessage());
            return false;
        }

        Thread.sleep(250);
        try {
            WebElement connect_button = driver.findElement(By.id("connect-button"));
            connect_button.click();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            test.log(Status.FAIL, "Exception: " + e.getMessage());
            return false;
        }

        return true;
    }

    public boolean jiffAllePartiesConnected(ExtentTest test) throws InterruptedException {
        Thread.sleep(500);
        try {
            WebElement output = driver.findElement(By.id("output"));
            for (WebElement element : output.findElements(By.xpath(".//*"))) {
                if (element.getText().equals("Alle Parteien verbunden!")) {
                    return true;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            test.log(Status.FAIL, "Exception: " + e.getMessage());
        }
        return false;
    }

    public boolean jiffEingaben(int inputClient, String operationName, String operationID, ExtentTest test) throws InterruptedException {
        Thread.sleep(250);
        try {
            // Tool um zu testen ob XPath Selenium kompatibel ist: https://www.webtoolkitonline.com/xml-xpath-tester.html
            WebElement tab_of_operation = driver.findElement(By.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' tab ') and normalize-space(text()) = '" + operationName + "']"));
            tab_of_operation.click();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            test.log(Status.FAIL, "Exception: " + e.getMessage());
            return false;
        }
        
        if (inputClient >= 0) {
            Thread.sleep(250);
            try {
                WebElement client_input_text_field = driver.findElement(By.id("client_input_" + operationID));
                client_input_text_field.clear();
                client_input_text_field.sendKeys(String.valueOf(inputClient));
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println(e.getMessage());
                test.log(Status.FAIL, "Exception: " + e.getMessage());
                return false;
            }
        }

        Thread.sleep(250);
        try {
            WebElement submit_button = driver.findElement(By.id("submit_button_" + operationID));
            submit_button.click();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            test.log(Status.FAIL, "Exception: " + e.getMessage());
            return false;
        }
        return true;
    }

    public String jiffGetResult(ExtentTest test) throws InterruptedException {
        try {
            WebElement output = driver.findElement(By.id("output"));
            // Maximal 30 Sekunden auf Resultat warten
            for (int i = 0; i < 120; ++i) {
                Thread.sleep(250);
                for (WebElement element : output.findElements(By.xpath(".//*"))) {
                    String text = element.getText();
                    if (text.startsWith("Resultat: ")) {
                        String result = text.substring(10);
                        Thread.sleep(500);
                        return result;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            test.log(Status.FAIL, "Exception: " + e.getMessage());
        }
        return "";
    }

}
