package aaatxt.model;


public class Counter implements Comparable<Counter>
{
	String name;
	
    int myCount;

    /**
     * Construct a counter whose value is zero.
     */
    public Counter(String name)
    {
    	this.name = name;
    	myCount = 0;
    }


    /**
     * Returns the value of the counter.
     * @return the value of the counter
     */
    public int getValue()
    {
    	return myCount;
    }

    /**
     * Zeros the counter so getValue() == 0.
     */
    public void clear()
    {
    	myCount = 0;
    }

    /**
     * Increase the value of the counter by one.
     */
    public void increment()
    {
    	myCount++;
    }

    /**
     * Return a string representing the value of this counter.
     * @return a string representation of the value
     */
    
    public String toString()
    {
    	return ""+myCount;
    }

	public int compareTo(Counter o) {
		// TODO Auto-generated method stub
		return  - Integer.valueOf(this.getValue()).compareTo(o.getValue());
	}


	public String getName() {
		return name;
	}
}

